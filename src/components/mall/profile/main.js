import Vue from 'vue';
import store from '@/store';
import pako from 'pako';

import VueAMap from 'vue-amap';
Vue.use(VueAMap);

import districts from '@/services/districts';

require('select2/dist/css/select2.css');
require('@/assets/css/select2-bootstrap.css');
require('X-editable/dist/bootstrap3-editable/css/bootstrap-editable.css');

require('select2/dist/js/select2.js');
require('X-editable/dist/bootstrap3-editable/js/bootstrap-editable.js');

$.fn.editable.defaults.mode = 'inline';
$.fn.editable.defaults.emptytext = '未填写';

$.fn.editabletypes.abstractinput.defaults.tpl = '<select multiple></select>';

VueAMap.initAMapApiLoader({
  key: 'a61c730af9a56dd7e9823e32c4926249',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType']
});

const adList = r => require.ensure([], () => r(require('@/components/mall/adList/main.vue')), 'ad-list');
const adManager = r => require.ensure([], () => r(require('@/components/mall/adManager/main.vue')), 'ad-manager');
const adListManager = r => require.ensure([], () => r(require('@/components/mall/adListManager/main.vue')), 'ad-list-manager');

export default {
  data() {
    return {
      adList: [],
      mallMap: {},
      adManagerVisible: false,
      bucketHost: `${process.env.qiniuBucketHost}`,
      adListManagerVisible: false,
      uploadLogoImageData:{}
    }
  },
  props: ['company', 'mall'],
  components: {
    adList,
    adManager,
    adListManager,
    Avatar: require('@/components/avatar/avatar.vue')
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  mounted() {
    this.initMallMap();
    this.fetchAdList();
  },
  methods: {
    fetchAdList() {
      let mallId = localStorage.getItem('mallId');

      if (this.mallId) {
        mallId = this.mallId;
      }

      Vue.$http.get(`${process.env.apiMall}/advertisement/getAdvertisementList`, {
        params: {
          mallId: mallId
        }
      }).then((response) => {
        this.adList = _.sortBy(response.data, (item) => item.orange);
      })
    },
    decodedData(data) {
      let stringText = '';
      const compressed = window.atob(data);
      const zipArray = pako.ungzip(compressed);
      for (var i = 0; i < zipArray.length; ++i) {
        stringText += String.fromCharCode(zipArray[i]);
      }
      return JSON.parse(stringText);
    },
    openAdManagerDialog() {
      this.adManagerVisible = true;
    },
    onAdManagerUpdate() {
      this.adManagerVisible = false;
      this.fetchAdList()
    },
    openAdListManagerDialog() {
      this.adListManagerVisible = true;
    },
    onAdListDeleted(itemId) {
      this.adList = this.adList.filter(item => item.id !== itemId);
    },
    beforeLogoUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        const upToken = response.data.Token;
        this.uploadLogoImageData = {
          key,
          token: upToken,
        };
      });
    },
    handleLogoUploadSuccess(response) {
      const key = response.key;
      const url = `${this.bucketHost}/${encodeURI(key)}`;
      let mallId = localStorage.getItem('mallId');
      let meId = localStorage.getItem('meId');

      if (this.$store.state.route.params.id) {
        mallId = this.$store.state.route.params.mallId;
      }

      Vue.$http.put(`${process.env.apiMall}/mall/modifyMallAttribute`, {
        id:mallId,
        identity:meId,
        iconPhotoUrl:url
      }).then((response)=>{
        this.$emit('reloadMallData');
      });
    },
    initMallMap() {
      this.mallMap = {
        zoom: 8,
        center: [this.mall.longitude, this.mall.latitude],
        plugin: [{
          pName: 'ToolBar'
        }],
        maker: {
          events: {
            click: () => {
              this.mallMap.window.visible = !this.mallMap.window.visible;
            }
          }
        },
        window: {
          position: [this.mall.longitude, this.mall.latitude],
          content: this.company.BrandName,
          visible: false
        }
      }
    }
  },
  directives: {
    editableInput: {
      bind: function (el, binding, vnode) {

        setTimeout(function() {

          $(el).editable();

          $(el).on('save', function(e, params) {
            const fieldObj = {};
            const fieldName = `${e.currentTarget.dataset.field}`;
            const maxLength = parseInt(e.currentTarget.dataset.maxlength);

            fieldObj['id'] = `${e.currentTarget.dataset.id}`;
            fieldObj['identity'] = `${e.currentTarget.dataset.ids}`;
            fieldObj[fieldName] = params.newValue;

            if (params.newValue.length <= maxLength || !maxLength) {
              Vue.$http.put(`${process.env.apiMall}/mall/modifyMallAttribute`,fieldObj).then(() => {

                if (fieldName === 'name') {
                  store.dispatch('myIdentities/updateMyIdentity', {
                    handle: 'name',
                    value: params.newValue
                  });
                }

                Vue.prototype.$notify({
                  title: '信息更新成功',
                  message: `${params.newValue}`,
                  type: 'success',
                  offset: 50
                });
                $(el).removeClass('editable-error');
              });
            } else {
              $(el).addClass('editable-error');
              Vue.prototype.$notify({
                title: '更新失败',
                message: `最多只能填写${maxLength}个字符`,
                type: 'error',
                offset: 50
              });
            }
          });

        }, 100);
      }
    }
  }
};

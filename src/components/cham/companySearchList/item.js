/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      checkedList: {},
      enterpriseTypeList:[],
      uploadLogoImageData:{},
      companySelectId:null,
      itemId:null,
      bucketHost: `${process.env.qiniuBucketHost}`
    }
  },
  props: [
    'items'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.fetchEnterpriseType();
  },
  methods: {
    formateEnterpriseType(typeId){
      const enterpriseType = _.find(this.enterpriseTypeList, item => item.typeId === typeId)
      if (enterpriseType) {
        return enterpriseType.child;
      }
      return [];
    },
    initSelectType(itemId) {
    Vue.set(this.checkedList[itemId], 'childTypeId', '');
    },
    hasChecked(cItem) {
      if (this.checkedList[cItem.Id]) {
        return true;
      }
      return false;
    },

    getCompanySelectId(Id,compamyId){
      this.companySelectId=compamyId;
      this.itemId = Id;
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
      const itemId = this.itemId;
      Vue.$http.post(`${process.env.apiCham}/commerceChamber/updateCompanyLogo`, {
        commerceChamberId:this.chamId,
        companyId:this.companySelectId,
        companyLogo:url,
        identity:this.meId
      }).then((response)=>{
        Vue.set(this.checkedList[itemId], `companyLogo`,url);
        this.$notify({
          title: '操作成功',
          message: '修改头像成功！',
          type: 'success',
          offset: 50
        });
      });
    },

    fetchEnterpriseType() {
        Vue.$http.get(`${process.env.apiCham}/enterpriseType/lists`,{
          params:{
            withChild:1
          }
        }).then((response) => {
            this.enterpriseTypeList = response.data;
        })
    },
    toggleToCheckedList(cItem) {
      if (!this.checkedList[cItem.Id]) {
        Vue.set(this.checkedList, `${cItem.Id}`, cItem);
        Vue.set(this.checkedList[cItem.Id], 'typeId', '');
        Vue.set(this.checkedList[cItem.Id], 'childTypeId', '');
        // Vue.set(this.checkedList[cItem.Id], 'companyLogo', '');
      } else {
        Vue.delete(this.checkedList, `${cItem.Id}`);
      }
      this.$emit('updateCheckedList', this.checkedList);
    }
  }
};

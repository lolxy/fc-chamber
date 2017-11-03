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
      uploadLogoImageData:{},
      companySelectId:null,
      bucketHost: `${process.env.qiniuBucketHost}`
    }
  },
  props: [
    'items',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    },
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  methods: {
    hasChecked(cItem) {
      if (this.checkedList[cItem.Id]) {
        return true;
      }
      return false;
    },

    getCompanySelectId(compamyId){
      this.companySelectId=compamyId;
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
      const itemId = this.companySelectId;
      Vue.$http.post(`${process.env.apiMall}/mall/updateCompanyLogo`, {
        mallId:this.mallId,
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

    toggleToCheckedList(cItem) {
      if (!this.checkedList[cItem.Id]) {
        Vue.set(this.checkedList, `${cItem.Id}`, cItem);
        Vue.set(this.checkedList[cItem.Id], 'addressDetailInMall', '');
      } else {
        Vue.delete(this.checkedList, `${cItem.Id}`);
      }

      this.$emit('updateCheckedList', this.checkedList);
    }
  }
};

import Vue from 'vue';
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      loginDialogVisible: false,
      checked:{},
      drapList:[]
    }
  },
  props: [
    'items',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
    draggable
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    },
    meId() {
      return localStorage.getItem('meId');
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  mounted() {
    if (this.items) {
      this.items.forEach((item) => {
        Vue.set(this.checked, item.companyId, true);
      })
      this.drapList=this.items;
    }
  },
  watch: {
    items(nVal) {
      this.drapList=this.items;
      this.items.forEach((item) => {
        Vue.set(this.checked, item.companyId, true);
      })
    }
  },
  methods: {
    datadragEnd (evt) {
      this.drapList.forEach((item, index) => {
        this.updateAdOrder(item, index)
      })
    },
    updateAdOrder(item,index) {
      Vue.$http.post(`${process.env.apiCham}/memberAd/update`, {
        companyId: item.companyId,
        commerceChamberId: this.chamId,
        identity: this.meId,
        position: index+1
      })
    },
    formatCardBg(item) {
      if (item.companyInfo.VisualizationImgUrl) {
        let visualImgUrl = item.companyInfo.VisualizationImgUrl;
        if (visualImgUrl.startsWith('http:')) { visualImgUrl = visualImgUrl.substring(5); }
        return `${visualImgUrl}?imageView2/1/w/600/h/200`;
      } else {
        if (item.companyInfo.LogoUrl) {
          let logoSrc = item.companyInfo.LogoUrl;
          if (logoSrc.startsWith('http:')) { logoSrc = logoSrc.substring(5); }
          return `${logoSrc}?imageView2/1/w/600/h/200`;
        }
        return null;
      }
    },
    getCompanyLogo(companyInfo) {
      if (companyInfo && companyInfo.LogoUrl) {
        return companyInfo.LogoUrl
      }
      return null
    },
    removeRecommondCompany(companyId) {
      Vue.$http.delete(`${process.env.apiCham}/memberAd/delete`, {
        params:{
          commerceChamberId:this.chamId,
          companyId:companyId,
          identity:this.meId
        }
      }).then((response) => {
        this.$notify({
          title: '操作成功',
          message: '已取消推荐',
          type: 'info',
          offset: 50
        });
        this.$emit("chamCompanyList");
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'info',
          offset: 50,
        });
      });
    }
  }
};

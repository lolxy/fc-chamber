import Vue from 'vue';

export default {
  data() {
    return {
      memberinfo: {},
      enterpriseTypeList:[],
      companySelectId:null,
      currentCompanyId:null,
      baseUrl: `${process.env.baseUrl}/company`,
    }
  },
  props: [
    'items',
    'currentChildTypeId',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId() {
      return localStorage.getItem('userId');
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  mounted() {
    if (this.items) {
      this.fetchEnterpriseType();
    }
  },
  watch: {
    items(nVal) {
      this.getExtProps();
    }
  },
  methods: {
    getExtProps() {
      this.items.forEach((item,index) => {
        if(item.identity){
          this.fetchExtProperties(item.identity,index);
        }
      })
    },
    fetchExtProperties(userId,index) {
      Vue.$http.get(`/Employees/${userId}`, {
        params: {
          meId: this.meId,
          fields:'RelationshipOfUs'
        }
      }).then((response) => {
        Vue.set(this.memberinfo, `user${userId}`, response.data)
      })
    },

    getCompanySelectId(compamyId){
      this.companySelectId=compamyId;
    },

    formateEnterpriseType(typeId){
      const enterpriseType = _.find(this.enterpriseTypeList, item => item.typeId === typeId)
      if (enterpriseType) {
        return enterpriseType.child;
      }
      return [];
    },

    getEnterpriseTypeName(typeId,childTypeId){
      const enterpriseType = _.find(this.enterpriseTypeList, item => item.typeId === typeId)
      if (enterpriseType) {
        // return enterpriseType.child;
        const enterpriseChildType = _.find(enterpriseType.child, item => item.typeId === childTypeId)
        if(enterpriseChildType){
          return enterpriseType.name + '-' + enterpriseChildType.name;
        }else{
          return enterpriseType.name;
        }
      }
      return "暂无分类";
      // return [];
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

    initSelectType() {
      this.updateVMemberTypeForm.childTypeId = null
      // Vue.set(this.checkedList[itemId], 'childTypeId', '');
    },

    formatCardBg(companyInfo) {
      let visualImgUrl = '';
      if (companyInfo && companyInfo.VisualizationImgUrl) {
        visualImgUrl = companyInfo.VisualizationImgUrl
        if (visualImgUrl.startsWith('http:')) { visualImgUrl = visualImgUrl.substring(5); }
        return `${visualImgUrl}?imageView2/1/w/600/h/200`;
      } else {
        if (companyInfo.LogoUrl) {
          let logoSrc = companyInfo.LogoUrl;
          if (logoSrc.startsWith('http:')) { logoSrc = logoSrc.substring(5); }
          return `${logoSrc}?imageView2/1/w/600/h/200`;
        }
        return null;
      }
      return null
    },

    getCompanyLogo(companyInfo) {
      if (companyInfo && companyInfo.LogoUrl) {
        return companyInfo.LogoUrl
      }
      return null
    },

    getCompanyAddress(companyInfo) {
      let address = ''
      if (companyInfo && companyInfo.ResidentProvince) {
        address = `${address}${companyInfo.ResidentProvince}`
      }
      if (companyInfo && companyInfo.ResidentCity) {
        address = `${address}${companyInfo.ResidentCity}`
      }
      if (companyInfo && companyInfo.ResidentArea) {
        address = `${address}${companyInfo.ResidentArea}`
      }
      return address
    },
  }
};

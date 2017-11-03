import Vue from 'vue';
import draggable from 'vuedraggable';
export default {
  data() {
    return {
      loginDialogVisible: false,
      addFriendDialogVisible: false,
      currentCompanyEmployees: [],
      companyExtProperties: {},
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
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  mounted() {
    if (this.items) {
      this.items.forEach((item) => {
        this.fetchCompanyExtProperties(item.companyId);
        Vue.set(this.checked, item.companyId, true);
      })
      this.drapList=this.items;
    }
  },
  watch: {
    items() {
      this.drapList=this.items;
      this.items.forEach((item) => {
        this.fetchCompanyExtProperties(item.companyId);
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
    fetchCompanyExtProperties(companyId) {
      Vue.$http.get('/CompanyExtRelateProperties', {
        params: {
          companyId: companyId,
          relType: 'mk_mall_company_ref',
          RelId: this.mallId
        }
      }).then((response) => {
        Vue.set(this.companyExtProperties, companyId, response.data);
      })
    },
    updateAdOrder(item,index) {
      Vue.$http.post(`${process.env.apiMall}/memberAd/update`, {
        companyId: item.companyId,
        mallId: this.mallId,
        identity: this.meId,
        position: index+1
      })
    },
    fetchRecommondStatus(companyId) {
      Vue.$http.post(`${process.env.apiMall}/memberAd/check`, {
          companyId: companyId,
          mallId: this.mallId
      }).then((response) => {
        Vue.set(this.statusJson, `status${companyId}`, response.data);
        if(response.data.status){
          Vue.set(this.checked, companyId, true);
        }else{
          Vue.set(this.checked, companyId, false);
        }
      })
    },
    getAddressInMall(props) {
      const currProp = props.filter(item => item.Key === 'addressDetailInMall');
      if (currProp.length) {
        return currProp[0].Data;
      }
      return '';
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
    addFriend(companyId) {
      if (this.$store.state.auth.authenticated) {
        this.fetchEmployeesByCompany(companyId);
      } else {
        this.loginDialogVisible = true;
      }
    },
    removeRecommond(companyId) {
      Vue.$http.delete(`${process.env.apiMall}/memberAd/delete`, {
        params:{
          mallId:this.mallId,
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
        this.$emit("mallCompanyList");
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'info',
          offset: 50,
        });
      });
    },
    addFaviourite(companyId) {
      if (this.$store.state.auth.authenticated) {
        Vue.$http.post('/EmployeeFavorites/Add', {
          EmployeeId: localStorage.getItem('meId'),
          RelType: 'Company',
          RelId: companyId,
        }).then((response) => {
          this.$notify({
            title: '添加收藏',
            message: '已成功添加收藏',
            type: 'info',
            offset: 50
          });
        }).catch((error) => {
          this.$notify({
            title: '已收藏',
            message: error.response.data.Message,
            type: 'info',
            offset: 50,
          });
        });
      } else {
        this.loginDialogVisible = true;
      }
    },
    fetchEmployeesByCompany(id) {
      const meId = localStorage.getItem('meId');
      const companyId = localStorage.getItem('companyId');

      Vue.$http.get('/Employees', {
        params: {
          meId: meId,
          CompanyId: id,
          IsShowInCompanySite: true,
          fields: 'User,Company,RelationshipOfUs',
        },
      }).then((response) => {
        this.currentCompanyEmployees = response.data;
        if (response.data.length) {
          this.addFriendDialogVisible = true;
        } else {
          this.$notify({
            title: 'Ooops!',
            message: '此商户尚未设置公开员工',
            type: 'info',
            offset: 50
          });
        }
      });
    },
    modifyCompanyInfo(id) {
      this.$prompt('在商城中的所在位置', '修改信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {

      })
    },
    deleteThisCompany(id) {
      this.$confirm('此操将从商城中移除该公司, 是否继续？', '提示', {
        confirmButtonText: '确定移除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const meId = localStorage.getItem('meId');
        Vue.$http.delete(`${process.env.apiMall}/memberAd/delete`, {
          params:{
            mallId:this.mallId,
            companyId:id,
            identity:meId
          }
        }).then(()=>{
          Vue.$http.delete(`${process.env.apiMall}/mall/deleteCompanyFromMall`, {
            params: {
              mallId: this.mallId,
              companyId: id,
              identity: meId
            }
          }).then(() => {
            this.$emit('mallCompanyDeleted');
            this.$notify({
              type: 'success',
              message: '成功移除公司!',
              offset: 30
            })
          })
        })
      })
    }
  }
};

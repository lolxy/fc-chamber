import Vue from 'vue';
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      loginDialogVisible: false,
      updateVMemberType:false,
      updateVCompanyType:false,
      addFriendDialogVisible: false,
      memberManagerVisible:false,
      memberinfo: {},
      checked:{},
      drapList:[],
      enterpriseTypeList:[],
      uploadLogoImageData:{},
      companySelectId:null,
      currentCompanyId:null,
      bucketHost: `${process.env.qiniuBucketHost}`,
      updateVMemberTypeForm:{
        commerceChamberId:'',
        companyId:'',
        typeId:'',
        childTypeId:'',
        identity:''
      },
      updateVMemberTypeFormRules:{
        typeId:[
          {required: true, type: 'number', message: '商会企业类型不能为空',trigger:'change'}
        ],
        childTypeId: [
          { required: true, type: 'number', message: '商会成员类型不能为空',trigger:'change'}
        ]
      },
    }
  },
  props: [
    'items',
    'currentChildTypeId',
    'isAllowSort'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
    pointMemberManager: require('@/components/cham/pointMemberManager/main.vue'),
    virtualCompanyManager:require('@/components/cham/virtualCompanyManager/main.vue'),
    draggable
  },
  computed: {
    me() {
      const meId = localStorage.getItem('meId');
      const me = this.$store.state.myIdentities.list.filter(item => item.Id === meId);
      if (me.length) {
        return me[0];
      }
      return {};
    },
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId() {
      return localStorage.getItem('userId');
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  mounted() {
    if (this.items) {
      this.drapList=this.items;
      this.getExtProps();
      this.items.forEach((item) => {
         Vue.set(this.checked, `recommendCompany${item.companyId}`, item.recommendCompany?true:false);
         Vue.set(this.checked, `recommendSite${item.companyId}`, item.recommendSite?true:false);
      });
      this.fetchEnterpriseType();
    }
  },
  watch: {
    items(nVal) {
      this.getExtProps();
      this.drapList=this.items;
      this.items.forEach((item) => {
        Vue.set(this.checked, `recommendCompany${item.companyId}`, item.recommendCompany?true:false);
        Vue.set(this.checked, `recommendSite${item.companyId}`, item.recommendSite?true:false);
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
      Vue.$http.post(`${process.env.apiCham}/commerceChamber/updateCompanyRange`, {
        companyId: item.companyId,
        commerceChamberId: this.chamId,
        identity: this.meId,
        range: index+1
      })
    },
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

    onManagerUpdate() {
      this.memberManagerVisible = false;
      this.$emit('chamCompanyDeleted');
    },

    pointThisMember(companyId) {
      this.memberManagerVisible = true;
      this.currentCompanyId = companyId;
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
      Vue.$http.post(`${process.env.apiCham}/commerceChamber/updateCompanyLogo`, {
        commerceChamberId:this.chamId,
        companyId:this.companySelectId,
        companyLogo:url,
        identity:this.meId
      }).then((response)=>{
        this.$emit('chamCompanyDeleted');
        this.$notify({
          title: '操作成功',
          message: '修改头像成功！',
          type: 'success',
          offset: 50
        });
      });
    },

    modifyThisMemberInfo(typeId,childTypeId,companyId) {
      this.updateVMemberType=true;
      this.updateVMemberTypeForm.typeId = typeId;
      this.updateVMemberTypeForm.childTypeId = childTypeId;
      this.updateVMemberTypeForm.companyId = companyId;
    },

    modifyThisCompanyInfo(companyId) {
      this.updateVCompanyType=true;
      this.currentCompanyId = companyId;
    },

    changeVMemberType(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
        Vue.$http.post(`${process.env.apiCham}/commerceChamber/updateVMemberType`,{
          commerceChamberId:this.chamId,
          companyId:this.updateVMemberTypeForm.companyId,
          typeId:this.updateVMemberTypeForm.typeId,
          childTypeId:this.updateVMemberTypeForm.childTypeId,
          identity:this.meId
        }).then((response) => {
          this.$notify({
            title: '操作成功',
            message: '修改商会类型成功！',
            type: 'success',
            offset: 50
          });
          this.updateVMemberType=false;
          this.$emit('chamCompanyDeleted');
        }).catch((error)=>{
          this.$notify({
            title: '操作失败',
            message: error.response.data.Message,
            type: 'error',
            offset: 50
          });
        });
      } else {
        return false;
      }
    });
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

    handleClose() {
      this.$refs.pointMemberManager.memberList = [];
      this.$refs.pointMemberManager.keyword='';
      this.memberManagerVisible = false;
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

    addFriend(user) {
      if (this.auth) {
        this.postAddFriend(user);
      }
    },

    postAddFriend(user) {
      const self = this;
      let requestMsg = '';

      if (self.me.CompanyId) {
        requestMsg = `我是《${self.me.Company.BrandName}》${self.me.JobTitle} - ${self.me.Name}，希望加你为好友!`;
      } else {
        requestMsg = `我是${self.me.Name}，希望加你为好友!`;
      }

      Vue.$http.post('/FriendRequests/Add', {
        SenderId: self.me.Id,
        ReceiverId: user.Id,
        GroupId: self.groupId,
        RequestMsg: requestMsg
      }).then(() => {
        if (this.memberinfo[`user${user.Id}`]) {
          this.memberinfo[`user${user.Id}`].RelationshipOfUs = 1;
        }
        this.$notify({
          title: '已发送添加好友请求',
          message: '请耐心等待对方通过',
          type: 'success',
          offset: 50
        });
      }).catch((error) => {
        this.$notify({
          title: '发生错误',
          message: error.response.data.Message,
          type: 'error'
        })
      });
    },

    setRecommondCompany(companyId) {
      Vue.$http.post(`${process.env.apiCham}/memberAd/create`, {
        commerceChamberId:this.chamId,
        companyId:companyId,
        identity:this.meId
      }).then((response) => {
        this.$notify({
          title: '操作成功',
          message: '已成功推荐',
          type: 'info',
          offset: 50
        });
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'info',
          offset: 50,
        });
      });
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
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'info',
          offset: 50,
        });
      });
    },

    setRecommondSite(companyId) {
      Vue.$http.post(`${process.env.apiCham}/sites/promote`, {
        commerceChamberId:this.chamId,
        companyId:companyId,
        identity:this.meId
      }).then((response) => {
        this.$notify({
          title: '操作成功',
          message: '已成功推荐',
          type: 'info',
          offset: 50
        });
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'info',
          offset: 50,
        });
      });
    },
    removeRecommondSite(companyId) {
      Vue.$http.delete(`${process.env.apiCham}/sites/delPromote`, {
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
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'info',
          offset: 50,
        });
      });
    },

    deleteThisMember(memId,companyId,id) {
      this.$confirm('此操将从商会中移除该成员, 是否继续？', '提示', {
        confirmButtonText: '确定移除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const meId = localStorage.getItem('meId');
        Vue.$http.delete(`${process.env.apiCham}/commerceChamber/deleteIdentityFromCommerceChamber`, {
            params: {
              commerceChamberId: this.chamId,
              memberIdentity: memId,
              identity: meId,
              recordId: id
            }
        }).then(()=>{
          if(this.checked[`recommendCompany${companyId}`]){
            Vue.$http.delete(`${process.env.apiCham}/memberAd/delete`, {
              params:{
                commerceChamberId:this.chamId,
                companyId:companyId,
                identity:this.meId
              }
            });
          };
          if(this.checked[`recommendSite${companyId}`]){
            Vue.$http.delete(`${process.env.apiCham}/sites/delPromote`, {
              params:{
                commerceChamberId:this.chamId,
                companyId:companyId,
                identity:this.meId
              }
            });
          };
          this.$emit('chamCompanyDeleted');
          this.$notify({
            type: 'success',
            message: '成功移除成员!',
            offset: 30
          });
        })
      })
    }
  }
};

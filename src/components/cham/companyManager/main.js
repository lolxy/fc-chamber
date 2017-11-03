import Vue from 'vue';

export default {
  name: 'cham-company-list',
  components: {
    companySearchList: require('@/components/cham/companySearchList/item.vue'),
    companyCreateNew: require('@/components/cham/companyCreateNew/item.vue')
  },
  data() {
    return {
      checkedList: {},
      memberList: [],
      searchResultLoaded:false,
      keyword: '',
      currentPage: 1,
      currentPageSize: 16,
      isVirtual:false,
      searchResultTitle:''
    }
  },
  computed: {
    checkedListKeys() {
      return Object.keys(this.checkedList);
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  methods: {
    searchMember() {
      const self = this;
      self.searchResultLoaded = false;
      if (self.keyword.length) {
        self.fetchMemberBykeyword();
      }
    },
    fetchMemberBykeyword() {
      const self = this;
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/Employees', {
        params: {
          meId: meId,
          fields: 'Company,User,RelationshipOfUs',
          'args.keyword': self.keyword
        },
      }).then((response) => {
        self.memberList = response.data;
        self.isVirtual=response.data.length?false:true;
        if(self.isVirtual){
          self.checkedList = {};
        }
        self.searchResultTitle=response.data.length?'':'没有搜索到您输入关键字的相关信息，请再下面表单中创建新成员！';
        self.searchResultLoaded = true;
        if(this.$refs.companycreatenew){
          this.$refs.companycreatenew.isShowAlert = response.data.length?false:true;
        }
      });
    },
    updateCheckedList(data) {
      this.checkedList = data;
    },
    resetSearch() {
      this.memberList = [],
      this.checkedList = {},
      this.keyword = ''
    },
    addCompaniesToCham() {
      const meId = localStorage.getItem('meId');
      const chamId = localStorage.getItem('chamId');
      this.checkedListKeys.forEach((key) => {
        const companyData = {
          commerceChamberId: chamId,
          companyId: this.checkedList[key].CompanyId,
          identity: meId,
          typeId:this.checkedList[key].typeId,
          childTypeId:this.checkedList[key].childTypeId,
          memberIdentity:this.checkedList[key].Id,
          companyLogo:this.checkedList[key].companyLogo
        }
        this.addCompanyToCham(companyData);
      })
    },
    addCompanyToCham(company) {
      Vue.$http.post(`${process.env.apiCham}/commerceChamber/addIdentityToCommerceChamber`, company).then((response) => {
        this.$notify({
          title: '操作成功',
          message: '您成功添加成员到商会！',
          type: 'success'
        });
        this.$emit('managerUpdate');
        this.resetSearch();
      }).catch((error)=>{
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'error'
        })
      });
    },
    closeDialog() {
      this.$emit('managerUpdate');
      this.resetSearch();
    }
  }
};

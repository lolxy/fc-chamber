import Vue from 'vue';

export default {
  name: 'mall-company-list',
  components: {
    companySearchList: require('@/components/mall/companySearchList/item.vue')
  },
  data() {
    return {
      checkedList: {},
      companyList: [],
      keyword: '',
      currentPage: 1,
      currentPageSize: 16
    }
  },
  computed: {
    checkedListKeys() {
      return Object.keys(this.checkedList);
    },
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  methods: {
    searchCompany() {
      this.fetchCompanyList();
    },
    fetchCompanyList() {
      Vue.$http.get('/Companies', {
        params: {
          keyword: this.keyword,
          skip: this.currentPageSize * (this.currentPage - 1),
          take: this.currentPageSize
        }
      })
      .then((response) => {
        this.companyList = response.data;
      });
    },
    updateCheckedList(data) {
      this.checkedList = data;
    },
    addCompaniesToMall() {
      const meId = localStorage.getItem('meId');
      const mallId = localStorage.getItem('mallId');
      this.checkedListKeys.forEach((key) => {
        const companyData = {
          mallId: mallId,
          companyId: this.checkedList[key].Id,
          identity: meId,
          addressDetailInMall: this.checkedList[key].addressDetailInMall,
          companyLogo:this.checkedList[key].companyLogo
        }
        this.addCompanyToMall(companyData);
      })
    },
    addCompanyToMall(company) {
      Vue.$http.post(`${process.env.apiMall}/mall/addCompanyToMall`, company).then((response) => {
        this.$emit('companyManagerUpdate');
      })
    }
  }
};

/* ============
 * Company List
 * ============
 */
import Vue from 'vue';
import province from '@/services/province';

export default {
  data() {
    return {
      companyLoading: true,
      currentPage: 1,
      currentPageSize: 16,
      pageSizes: [16, 24, 36, 48, 64],
      companyList: [],
      totalCompanies: null,
      filters: {
        currentRole: null,
        currentCategory: null,
        currentIndustry: null,
        currentIndustryType: null,
        currentIndustryProperty: null,
        currentLocation: null,
      },
      currentKeyword: null,
      showAllIndustry: false,
      roleList: [
        {
          Id: '0',
          Name: '所有商户',
          Value: null
        },
        {
          Id: '1',
          Name: '商户（ 已认证 ）',
          Value: '商户'
        },
        {
          Id: '2',
          Name: '商户（ 未认证 ）',
          Value: '个体商户'
        },
        {
          Id: '3',
          Name: '公司（ 已认证 ）',
          Value: '公司'
        }
      ],
      location: province
    };
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
    profileGrid: require('@/components/company/profileGrid/item.vue'),
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    companyCats() {
      const cats = [{
        Id: null,
        Name: '所有公司类型'
      }];
      return cats.concat(this.$store.state.companyCats.companyCats);
    },
    companyCatsLoaded() {
      return this.$store.state.companyCats.companyCatsLoaded;
    },
    industry() {
      const cats = [{
        Id: null,
        Name: '所有行业'
      }];
      return cats.concat(this.$store.state.companyCats.industryCats);
    },
    industryLoaded() {
      return this.$store.state.companyCats.industryCatsLoaded;
    },
    industryTypes() {
      const cats = [{
        Id: null,
        Name: '所有行业类型'
      }];
      return cats.concat(this.$store.state.companyCats.industryTypes);
    },
    industryTypesLoaded() {
      return this.$store.state.companyCats.industryTypesLoaded;
    },
    industryProps() {
      const cats = [{
        Id: null,
        Name: '所有行业类型'
      }];
      return cats.concat(this.$store.state.companyCats.industryProps);
    },
    industryPropsLoaded() {
      return this.$store.state.companyCats.industryPropsLoaded;
    },
    industryFiltered() {
      let industryList =  this.industry;
      if (this.filters.currentIndustryProperty) {
        industryList = industryList.filter(item => item.ParentId === this.filters.currentIndustryProperty);
      }
      return industryList.filter((item, index) => {
        if (this.showAllIndustry) {
          return item;
        }
        return index < 18;
      });
    }
  },
  mounted() {
    this.initCheckedFilters();

    if (this.$store.state.route.query.keyword) {
      const keyword = this.$store.state.route.query.keyword;
      this.currentKeyword = keyword;
    }
    this.fetchCompanyList();
  },
  methods: {
    searchCompany() {
      this.resetCompanyList();
      this.companyLoading = true;
      this.fetchCompanyList();
    },
    showMoreIndustry() {
      this.showAllIndustry = true;
    },
    showLessIndustry() {
      this.showAllIndustry = false;
    },
    getCurrentIndustry(id) {
      this.filters.currentIndustry = id;
    },
    removeCurrentIndustry() {
      this.filters.currentIndustry = null;
    },
    getCurrentIndustryProperty(id) {
      this.filters.currentIndustryProperty = id;
    },
    removeCurrentIndustryProperty() {
      this.filters.currentIndustryProperty = null;
    },
    getCurrentRole(id) {
      this.filters.currentRole = id;
    },
    removeCurrentRole() {
      this.filters.currentRole = null;
    },
    getCurrentCategory(id) {
      this.filters.currentCategory = id;
    },
    removeCurrentCategory() {
      this.filters.currentCategory = null;
    },
    getCurrentIndustryType(id) {
      this.filters.currentIndustryType = id;
    },
    removeCurrentIndustry() {
      this.filters.currentIndustryType = null;
    },
    resetCompanyList() {
      this.companyList = [];
      this.totalCompanies = null;
    },
    fetchCompanyList() {
      let filterIds = [this.filters.currentCategory, this.filters.currentIndustry, this.filters.currentIndustryType].filter(val => val).join(',');
      if (this.$store.state.route.query.categories) {
        filterIds = this.filters.currentIndustry;
      }
      Vue.$http.get('/Companies', {
        params: {
          fields: 'Categories,HasProducts',
          Type: this.filters.currentRole,
          CategoryId: filterIds,
          Province: this.filters.currentLocation,
          Keyword: this.currentKeyword,
          Skip: this.currentPageSize * (this.currentPage - 1),
          Take: this.currentPageSize,
        },
      })
      .then((response) => {
        if (this.totalCompanies !== Number(response.headers.total)) {
          this.totalCompanies = Number(response.headers.total);
        }
        this.companyList = this.companyList.concat(response.data);
        if (this.companyLoading) {
          this.companyLoading = false;
        }
      });
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.companyList = [];

      this.companyLoading = true;

      this.fetchCompanyList();
    },
    handleCurrentChange(val) {
      const filterIds = this.getCurrentFilterIds();
      let newHref = `${window.location.origin}${window.location.pathname}`;

      if (filterIds) {
        newHref = `${window.location.origin}${window.location.pathname}?page=${val}&categories=${filterIds}`;
      }

      this.currentPage = val;
      this.companyLoading = true;

      window.history.pushState({page: 'company list', currentPage: val}, `Page ${val}`, newHref);

      this.companyList = [];
      this.fetchCompanyList();
    },
    getCurrentFilterIds() {
      return [this.filters.currentIndustryProperty, this.filters.currentCategory, this.filters.currentIndustry, this.filters.currentIndustryType].filter(val => val).join(',');
    },
    getCurrentRoleId() {
      const currentRole = this.roleList.filter(item => item.Value === this.filters.currentRole);
      if (currentRole.length) {
        return currentRole[0].Id;
      }
      return null;
    },
    initCheckedFilters() {
      if (this.$store.state.route.query.categories) {
        const categories = this.$store.state.route.query.categories.split(',');
        categories.forEach((currentCategory) => {
          const companyCats = this.companyCats.filter(item => item.Id == currentCategory);
          const industryList = this.industry.filter(item => item.Id == currentCategory);
          const industryTypes = this.industryTypes.filter(item => item.Id == currentCategory);
          const industryProps = this.industryProps.filter(item => item.Id == currentCategory);
          if (companyCats.length) {
            this.filters.currentCategory = currentCategory;
          }
          if (industryList.length) {
            this.filters.currentIndustry = currentCategory;
          }
          if (industryTypes.length) {
            this.filters.currentIndustryType = currentCategory;
          }
          if (industryProps.length) {
            this.filters.currentIndustryProperty = currentCategory;
          }
        })
      }
      if (this.$store.state.route.query.type) {
        const currentRole = this.roleList.filter(item => item.Id === this.$store.state.route.query.type);
        if (currentRole.length) {
          this.filters.currentRole = currentRole[0].Value;
        }
      }
    }
  },
  watch: {
    filters: {
      handler(val, oldVal) {
        const filterIds = this.getCurrentFilterIds();
        const roleId = this.getCurrentRoleId();
        let newHref = `${window.location.origin}${window.location.pathname}`;

        this.companyLoading = true;

        this.resetCompanyList();
        this.fetchCompanyList();

        if (filterIds) {
          newHref = `${newHref}?categories=${filterIds}`;
        }

        if (roleId) {
          newHref = `${newHref}?type=${roleId}`;
        }

        window.history.pushState({ page: 'company list' }, 'Company list', newHref);
      },
      deep: true
    },
    industryLoaded(nVal, oVal) {
      this.initCheckedFilters();
    }
  }
};

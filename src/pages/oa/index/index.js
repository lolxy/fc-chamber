/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

export default {
  data() {
    return {
      company: {},
    }
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    profileHeader: require('@/components/company/profileHeader/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    companyId() {
      return this.$store.state.route.params.id;
    },
    myCompanyId() {
      return localStorage.getItem('companyId');
    },
    myCompanies() {
      return this.$store.state.myCompanies;
    },
    isMyCompany() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myCompanies.list.filter((item) => {
        return item.OwnerId === userId && item.Id === currentCompanyId;
      });
      if (myCompany.length) {
        return true;
      }
      return false;
    }
  },
  methods: {
    fetchCompanyById(id) {
      const meId = localStorage.getItem('meId');

      let params = {
        fields: 'Categories,HasProducts'
      }

      if (this.auth) {
        params = {
          meId: localStorage.getItem('meId'),
          fields: 'Categories,HasProducts,RelationshipOfUs'
        }
      }

      Vue.$http.get(`/Companies/${id}`, {params})
      .then((response) => {
        this.company = response.data;
      });
    },
  },
  mounted() {
    if (this.$store.state.route.params.id) {
      this.fetchCompanyById(this.companyId);
    }
  },
  watch: {
    companyId() {
      if (this.$store.state.route.params.id) {
        this.fetchCompanyById(this.companyId);
      }
    },
  }
};

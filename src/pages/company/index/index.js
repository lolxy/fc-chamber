/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';
import _ from 'lodash';
import store from '@/store';

export default {
  data() {
    return {
      company: {},
      allEmployeeRoles:[],
      allRoleList:{}
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
    userId() {
      return localStorage.getItem('userId');
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
      if(myCompany.length){
        return true;
      }
      return false;
    },
    isManager() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myManager = this.$store.state.myCompanies.list.filter((item) => {
        return item.Id === currentCompanyId;
      });
      if (myManager.length) {
        return true;
      }
      return false;
    },
    cIdentity() {
      const meId = localStorage.getItem('meId');
      const cIdentity = _.find(store.state.myIdentities.list, item => item.Id === meId);
      if (cIdentity && cIdentity.Id) {
        return cIdentity;
      }
      return {};
    },
    formatAllEmployeeRoles(){
      if(this.allEmployeeRoles.length){
        this.allEmployeeRoles.forEach((item)=>{
          Vue.set(this.allRoleList,`${item.Code}`,_.map(item.Employees,(item)=>{
            return {
              'UserId':item.UserId
            }
          }));
        });
      }
      return this.allRoleList;
    },
    siteBuilderPage() {
      return `${process.env.corpsiteBaseUrl}/builder/?company=${this.myCompanyId}`
    },
    newsManagerPage() {
      return `${process.env.corpsiteBaseUrl}/news/?company=${this.myCompanyId}`
    },
    productsManagerPage() {
      return `${process.env.corpsiteBaseUrl}/shop/?company=${this.myCompanyId}`
    }
  },
  methods: {
    fetchRoles() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/My/EmployeeRoles',{
        params: {
          meId:meId,
          fields: 'Employees.Roles'
        },
      }).then((response) => {
        this.allEmployeeRoles = response.data;
      });
    },
    getRoles(roles){
      if(this.formatAllEmployeeRoles && this.formatAllEmployeeRoles[roles]){
        const myRoles = this.formatAllEmployeeRoles[roles].filter((item) => {
          return item.UserId === this.userId;
        });
        if (myRoles.length) {
          return true;
        }
      }
      return false;
    },
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

      Vue.$http.get(`/Companies/${id}?fields=hasSites`, {params})
      .then((response) => {
        this.company = response.data;
      });
    },
  },
  mounted() {
    if (this.$store.state.route.params.id) {
      this.fetchCompanyById(this.companyId);
      this.fetchRoles();
    }
  },
  watch: {
    companyId() {
      if (this.$store.state.route.params.id) {
        this.fetchCompanyById(this.companyId);
        this.fetchRoles();
      }
    },
  }
};

/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      loginDialogVisible: false,
      addFriendDialogVisible: false,
      currentCompanyEmployees: [],
    }
  },
  props: [
    'items',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    }
  },
  methods: {
    formatCardBg(item) {
      if (item.VisualizationImgUrl) {
        let visualImgUrl = item.VisualizationImgUrl;
        if (visualImgUrl.startsWith('http:')) { visualImgUrl = visualImgUrl.substring(5); }
        return `${visualImgUrl}?imageView2/1/w/600/h/200`;
      } else {
        if (item.LogoUrl) {
          let logoSrc = item.LogoUrl;
          if (logoSrc.startsWith('http:')) { logoSrc = logoSrc.substring(5); }
          return `${logoSrc}?imageView2/1/w/600/h/200`;
        }
        return null;
      }
    },
    addFriend(companyId) {
      if (this.$store.state.auth.authenticated) {
        this.fetchEmployeesByCompany(companyId);
      } else {
        this.loginDialogVisible = true;
      }
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
  },
};

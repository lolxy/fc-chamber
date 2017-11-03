/* ============
 * Header
 * ============
 */

import store from '@/store';
import authService from '@/services/auth';

export default {
  data() {
    return {
      isFullscreen: false,
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    routeName() {
      return this.$store.state.route.name;
    },
    routeRoot() {
      return this.$store.state.route.name.split('.')[0];
    },
    myProfile() {
      return this.$store.state.myProfile.info;
    },
    myIdentities() {
      return this.$store.state.myIdentities;
    },
    myCompanies() {
      return this.$store.state.myCompanies;
    },
    myOwnCompanies() {
      const userId = localStorage.getItem('userId');
      const myOwnList = this.$store.state.myCompanies.list.filter(item => item.OwnerId === userId);
      if (myOwnList.length) {
        return myOwnList;
      }
      return [];
    },
    myCompany() {
      const companyId = localStorage.getItem('companyId');
      const currentCompany = this.myIdentities.list.filter(item => item.CompanyId === companyId);
      if (currentCompany.length) {
        return currentCompany[0];
      } else {
        myService.resetIdentity();
        return {};
      }
    },
    cIdentity() {
      const meId = localStorage.getItem('meId');
      const cIdentity = this.$store.state.myIdentities.list.filter(item => item.Id === meId);
      if (cIdentity.length) {
        return cIdentity[0];
      }
      return {};
    },
    companyId() {
      return this.$store.state.route.params.id;
    },
    myCompanyId() {
      return localStorage.getItem('companyId');
    },
    isMyCompany() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myCompanies.list.filter((item) => {
        return item.Id === currentCompanyId;
      });
      if (myCompany.length) {
        return true;
      }
      return false;
    },
    isMyOwnCompany() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myCompanies.list.filter((item) => {
        return item.OwnerId === userId && item.Id === currentCompanyId;
      });
      if (myCompany.length) {
        return true;
      }
      return false;
    },
    msgUnreadCount() {
      return this.$store.state.nim.unreadCount;
    }
  },
  methods: {
    launchIntoFullscreen() {
      const element = document.documentElement;
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      this.isFullscreen = true;
    },
    exitFullscreen() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.isFullscreen = false;
    },
    goToPage(pageName) {
      store.dispatch('contact/toggleContactPanel', false);
      this.$router.push({ name: pageName });
    },
    goToMyCompany(page){
      const myCompanyId = localStorage.getItem('companyId');
      store.dispatch('contact/toggleContactPanel', false);
      this.$router.push({ name: `company.${page}`, params: { id: myCompanyId }})
    },
    switchIdentity(meId, companyId) {
      myService.switchIdentity({
        meId: meId,
        companyId: companyId
      });
    },
    logout() {
      authService.logout();
    },
  },
};

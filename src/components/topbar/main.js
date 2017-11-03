/* ============
 * Header
 * ============
 */

import store from '@/store';
import authService from '@/services/auth';
import myService from '@/services/my';
import Favico from 'favico.js';

const favicon = new Favico({
  animation:'none'
});

export default {
  name: 'topbar',
  data() {
    return {
      isFullscreen: false,
      loginDialogVisible: false,
    }
  },
  components: {
    Avatar: require('@/components/avatar/avatar.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    routeName() {
      return this.$store.state.route.name;
    },
    routeRoot() {
      return this.$store.state.route.path.split('/')[1];
    },
    contactVisible() {
      return this.$store.state.contact.panelVisible;
    },
    //获取所属商会id
    chamId() {
      return this.$store.state.myCham.cham.id;
    },
    mallId() {
      return this.$store.state.myMall.mall.id;
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
      const cIdentity = _.find(store.state.myIdentities.list, item => item.Id === meId);
      if (cIdentity && cIdentity.Id) {
        return cIdentity;
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
      let counts = this.$store.state.nim.unreadCount;
      if (counts > 99) {
        counts = '99+';
      }
      favicon.badge(counts);
      return counts;
    },
    mySiteLink() {
      return `${process.env.corpsiteBaseUrl}/builder/?company=${this.myCompanyId}`
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
    toggleContactPanel() {
      if (!this.contactVisible) {
        store.dispatch('contact/switchContactPanel', 'contact.sessions');
        store.dispatch('contact/toggleContactPanel', true);
      } else {
        store.dispatch('contact/toggleContactPanel', false);
      }
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
    openLoginDialog() {
      this.loginDialogVisible = true;
    },
    closeLoginDialog() {
      this.loginDialogVisible = false;
    },
    logout() {
      authService.logout();
    },
  },
};

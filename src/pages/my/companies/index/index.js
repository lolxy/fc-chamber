import store from '@/store';
import authService from '@/services/auth';
import myService from '@/services/my';

export default {
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    profileGrid: require('@/components/company/profileGrid/item.vue'),
  },
  computed: {
    myProfile() {
      return this.$store.state.myProfile.info;
    },
    myOwnCompanies() {
      const userId = localStorage.getItem('userId');
      const myOwnList = this.$store.state.myCompanies.list.filter(item => item.OwnerId === userId);
      if (myOwnList.length) {
        return myOwnList;
      }
      return [];
    },
  },
};
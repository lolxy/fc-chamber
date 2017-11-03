import fetchFollowingList from '@/services/my/following/fetchFollowingList';
import fetchFollowingTypes from '@/services/my/following/fetchFollowingTypes';

export default {
  components: {
    vLayout: require('@/layouts/default/default.vue'),
    gridItem: require('@/components/following/gridItem/item.vue'),
  },
  computed: {
    followingList() {
      return this.$store.state.myFollowing.list;
    },
    followingTypes() {
      return this.$store.state.myFollowing.types;
    },
  },
  mounted() {
    if (!Object.keys(this.followingTypes).length) {
      fetchFollowingTypes();
    }
    if (!this.followingList.length) {
      fetchFollowingList();
    }
  }
};

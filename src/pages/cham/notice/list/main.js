const noticeList = r => require.ensure([], () => r(require('@/components/cham/noticeList/main.vue')), 'notice-list');

export default {
  name: 'cham-notice-list',
  components: {
    noticeList: noticeList
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  }
};

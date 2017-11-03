const noticeManager = r => require.ensure([], () => r(require('@/components/cham/noticeManager/main.vue')), 'notice-manager');

export default {
  name: 'cham-notice-manager',
  components: {
    noticeManager: noticeManager
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
};

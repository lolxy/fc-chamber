const applyList = r => require.ensure([], () => r(require('@/components/cham/applyList/main.vue')), 'apply-list');

export default {
  name: 'cham-apply-list',
  components: {
    applyList: applyList
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

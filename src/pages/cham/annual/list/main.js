const annualList = r => require.ensure([], () => r(require('@/components/cham/annualList/main.vue')), 'annual-list');

export default {
  name: 'cham-annual-list',
  components: {
    annualList: annualList
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

const badrecordList = r => require.ensure([], () => r(require('@/components/cham/badrecordList/main.vue')), 'badrecord-list');

export default {
  name: 'cham-badrecord-list',
  components: {
    badrecordList: badrecordList
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

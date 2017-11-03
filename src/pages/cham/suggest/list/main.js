const suggestList = r => require.ensure([], () => r(require('@/components/cham/suggestList/main.vue')), 'suggest-list');
const suggestCreate = r => require.ensure([], () => r(require('@/components/cham/suggestCreate/main.vue')), 'suggest-create');

export default {
  name: 'cham-suggest-list',
  components: {
    suggestList: suggestList,
    suggestCreate:suggestCreate
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

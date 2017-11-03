const articleManager = r => require.ensure([], () => r(require('@/components/cham/articleManager/main.vue')), 'article-manager');

export default {
  name: 'cham-article-manager',
  components: {
    articleManager: articleManager
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

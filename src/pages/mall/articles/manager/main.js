const articleManager = r => require.ensure([], () => r(require('@/components/mall/articleManager/main.vue')), 'article-manager');

export default {
  name: 'mall-article-manager',
  components: {
    articleManager: articleManager
  },
  computed: {
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
};

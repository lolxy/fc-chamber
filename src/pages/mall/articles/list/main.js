const articleList = r => require.ensure([], () => r(require('@/components/mall/articleList/main.vue')), 'article-list');

export default {
  name: 'mall-article-list',
  components: {
    articleList: articleList
  },
  computed: {
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  }
};

const topicList = r => require.ensure([], () => r(require('@/components/mall/topicList/main.vue')), 'article-list');

export default {
  name: 'mall-topic-list',
  components: {
    topicList: topicList
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

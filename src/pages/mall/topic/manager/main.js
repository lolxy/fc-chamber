const topicManager = r => require.ensure([], () => r(require('@/components/mall/topicManager/main.vue')), 'topic-manager');

export default {
  name: 'mall-topic-manager',
  components: {
    topicManager: topicManager
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

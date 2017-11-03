export default {
  components: {
    vLayout: require('@/layouts/default/default.vue'),
    taskDetail: require('@/components/tasks/taskDetail/main.vue'),
  },
  computed: {
    taskId() {
      return this.$store.state.route.params.taskId;
    },
  },
};

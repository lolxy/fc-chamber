export default {
  computed: {
    mallId() {
      return this.$store.state.route.params.mallId;
    }
  }
};

import Vue from 'vue';

export default {
  data() {
    return {
      list: {}
    }
  },
  computed: {
    mallId() {
      return this.$store.state.route.params.mallId;
    }
  },
  mounted() {
    this.fetchArticleList();
  },
  methods: {
    fetchArticleList() {
      let mallId = localStorage.getItem('mallId');

      if (this.mallId) {
        mallId = this.mallId;
      }

      Vue.$http.get(`${process.env.apiMall}/community/lists`, {
        params: {
          mallId: mallId
        }
      }).then((response) => {
        this.list = response.data;
      })
    }
  }
};

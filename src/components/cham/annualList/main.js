import Vue from 'vue';

export default {
  data() {
    return {
      list:[]
    }
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    this.fetchAnnualList();
  },
  methods: {
    fetchAnnualList() {
      let chamId = localStorage.getItem('chamId');

      if (this.chamId) {
        chamId = this.chamId;
      }

      const listParams = {
        commerceChamberId:chamId,
        identity:this.meId
      };

      Vue.$http.get(`${process.env.apiCham}/summary/lists`, {
        params: listParams,
      }).then((response) => {
        this.list = response.data;
      });
    }
  }
};

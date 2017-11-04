import Vue from 'vue';

export default {
  name: 'cham-notice-entry',
  data() {
    return {
      entry: {},
      latestList: []
    }
  },
  computed: {
    noticeId() {
      return this.$store.state.route.params.entryId;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    this.fetchNotice();
  },
  methods: {
    fetchNotice() {
      Vue.$http.get(`${process.env.apiCham}/notice/info`, {
        params: {
          noticeId: this.noticeId
        }
      }).then((response) => {
        this.entry = response.data;
        this.fetchLatestNoticeList();
      })
    },
    fetchLatestNoticeList() {
      Vue.$http.get(`${process.env.apiCham}/notice/lists`, {
        params: {
          commerceChamberId: this.chamId,
          singlePage: 5,
          page:0,
          type:''
        }
      }).then((response) => {
        this.latestList = response.data;
      })
    }
  },
  watch: {
    noticeId() {
      this.fetchNotice();
    }
  }
};

import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      noticelist: [],
      currentPage: 0
    }
  },
  computed:{
    auth() {
      return this.$store.state.auth.authenticated;
    },
    routeName() {
      return this.$store.state.route.name;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  components: {
    InfiniteLoading,
    placeholder: require('@/components/placeholder/item.vue')
  },
  methods: {
    fetchNoticeList() {
      const listParams = {
        commerceChamberId:this.chamId,
        singlePage: 10,
        type: '',
        page: this.currentPage,
      };
      console.log(listParams);
      Vue.$http.get(`${process.env.apiCham}/notice/lists`, {
        params: listParams,
      }).then((response) => {
        let list = response.data;
        console.log(list);
        if (list.length) {
          this.noticelist = this.noticelist.concat(list);
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (list.length < 10) {
            this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentPage = this.currentPage + 1;
        } else {
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    onListInfinite() {
      this.fetchNoticeList();
    },
    reloadList() {
      this.noticelist = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    backtop() {
      $("body,html").animate({scrollTop:0},500);
    }
  }
}

import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      list: [],
      currentPage: 0,
      chamName:''
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
  components: {
    InfiniteLoading,
    placeholder: require('@/components/placeholder/item.vue')
  },
  mounted() {
    //do something after mounting vue instance
    this.getChamName()
  },
  methods: {
    fetchapplyList() {
      let chamId = localStorage.getItem('chamId');

      if (this.chamId) {
        chamId = this.chamId;
      }

      const listParams = {
        commerceChamberId:chamId,
        singlePage: 10,
        identity:this.meId,
        page: this.currentPage
      };

      Vue.$http.get(`${process.env.apiCham}/apply/lists`, {
        params: listParams,
      }).then((response) => {
        console.log(response);
        let list = response.data;

        if (list.length) {
          this.list = this.list.concat(list);
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
      this.fetchapplyList();
    },
    reloadList() {
      this.list = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    getChamName() {
      Vue.$http.get(`${process.env.apiCham}/commerceChamber/getCommerceChamberDetail`, {
        params: {
          commerceChamberId: this.chamId
        }
      }).then((response) => {
        this.chamName = response.data.name;
      })
    },
    backtop() {
      $("body,html").animate({scrollTop:0},500);
    }
  }
};

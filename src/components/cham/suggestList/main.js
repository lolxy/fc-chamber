import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      list: [],
      currentPage: 0,
      activeNames: ['1'],
      memberinfo: {}
    }
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  components: {
    InfiniteLoading,
    placeholder: require('@/components/placeholder/item.vue')
  },
  methods: {
    fetchSuggestList() {
      let chamId = localStorage.getItem('chamId');

      if (this.chamId) {
        chamId = this.chamId;
      }

      const listParams = {
        commerceChamberId:chamId,
        singlePage: 10,
        identity:localStorage.getItem('meId'),
        page: this.currentPage,
      };

      Vue.$http.get(`${process.env.apiCham}/feedback/lists`, {
        params: listParams,
      }).then((response) => {
        let list = response.data;
        if (list.length) {
          this.list = this.list.concat(list);

          list.forEach((item) => {
            this.getUserInfo(item.identity)
          })

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
    getUserInfo(userId) {
      if (!this.memberinfo[`user${userId}`]) {
        this.fetchgetUserInfo(userId)
      }
    },
    fetchgetUserInfo(userId) {
      Vue.$http.get(`/Employees/${userId}`, {
        params: {
          meId:localStorage.getItem('meId')
        }
      }).then((response) => {
        Vue.set(this.memberinfo, `user${userId}`, response.data)
      })
    },

    getItemTitle(identity) {
      const currMember = this.memberinfo[`user${identity}`]
      if (currMember && currMember.Id) {
        if(currMember.Name && currMember.JobTitle){
            return `${currMember.Name}.${currMember.JobTitle}的反馈意见`
        }else{
            return `${currMember.Name}的反馈意见`
        }
      }
    },

    onListInfinite() {
      this.fetchSuggestList();
    },
    reloadList() {
      this.list = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    backtop() {
      $("body,html").animate({scrollTop:0},500);
    }
  }
};

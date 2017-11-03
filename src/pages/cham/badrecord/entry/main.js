import Vue from 'vue';

const commentForm = r => require.ensure([], () => r(require('@/components/cham/topicCommentForm/main.vue')), 'topic-comment-form');

export default {
  name: 'cham-badrecord-entry',
  data() {
    return {
      badrecord: {},
      commentList: [],
      latestList: [],
      commentData:[]
    }
  },
  components: {
    commentForm
  },
  computed: {
    badrecordId() {
      return this.$store.state.route.params.recordId;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    this.fetchBadrecord();
    this.fetchBadrecordComments();
    this.fetchLatestBadrecordList();
  },
  methods: {
    fetchBadrecord() {
      Vue.$http.get(`${process.env.apiCham}/blackList/show`, {
        params: {
          recordId: this.badrecordId,
          identity:this.meId
        }
      }).then((response) => {
        this.badrecord = response.data;
      })
    },
    fetchBadrecordComments() {
      Vue.$http.get(`${process.env.apiCham}/blackList/shareList`, {
        params: {
          recordId: this.badrecordId,
          identity:this.meId
        }
      }).then((response) => {
        this.commentList = response.data;
      })
    },
    dellRecord() {
      this.$confirm('确定删除该不良记录?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '暂不删除',
        type: 'error'
      }).then(() => {
        Vue.$http.delete(`${process.env.apiCham}/blackList/delete`, {
          params: {
            recordId: this.badrecordId,
            identity:this.meId
          }
        }).then((response) => {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: '不良记录删除成功',
            offset: 50
          });
          this.$router.push({name: 'cham.badrecord.list'});
        })
      });
    },
    dellComment(commentId) {
      this.$confirm('确定删除该评论?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '暂不删除',
        type: 'error'
      }).then(() => {
        Vue.$http.delete(`${process.env.apiCham}/blackList/delComment`, {
          params: {
            shareId:commentId,
            identity:this.meId
          }
        }).then((response) => {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: '评论删除成功',
            offset: 50
          });
          this.fetchBadrecordComments();
        })
      });
    },
    editComment(commentId) {
      Vue.$http.get(`${process.env.apiCham}/blackList/shareInfo`, {
        params: {
          shareId:commentId,
          identity:this.meId
        }
      }).then((response) => {
        this.commentData = response.data;
      })
    },
    fetchLatestBadrecordList() {
      const chamId = this.chamId;
      Vue.$http.get(`${process.env.apiCham}/blackList/lists`, {
        params: {
          commerceChamberId: chamId,
          page:0,
          singlePage: 5,
          identity:this.meId
        }
      }).then((response) => {
        this.latestList = response.data;
      })
    },
  },
  watch: {
    badrecordId() {
      this.fetchBadrecord();
      this.fetchBadrecordComments();
    }
  }
};

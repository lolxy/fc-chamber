import Vue from 'vue';

const commentForm = r => require.ensure([], () => r(require('@/components/mall/topicCommentForm/main.vue')), 'topic-comment-form');
const replyForm = r => require.ensure([], () => r(require('@/components/mall/topicReplyForm/main.vue')), 'topic-reply-form');

export default {
  name: 'mall-topic-entry',
  data() {
    return {
      entry: {},
      commentList: [],
      commentUsers: {},
      latestList: [],
      currentReply: {}
    }
  },
  components: {
    commentForm,
    replyForm
  },
  computed: {
    topicId() {
      return this.$store.state.route.params.topicId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  mounted() {
    this.fetchArticle();
    this.fetchArticleComments();
    this.fetchLatestArticleList();
  },
  methods: {
    fetchArticle() {
      Vue.$http.get(`${process.env.apiMall}/community/show`, {
        params: {
          topicId: this.topicId
        }
      }).then((response) => {
        this.entry = response.data;
        this.addReadCount();
      })
    },
    addReadCount() {
      this.entry.readCount += 1;
      Vue.$http.get(`${process.env.apiMall}/community/read`, {
        params: {
          topicId: this.topicId
        }
      })
    },
    fetchArticleComments() {
      Vue.$http.get(`${process.env.apiMall}/community/comment/lists`, {
        params: {
          topicId: this.topicId
        }
      }).then((response) => {
        this.commentList = response.data;
        this.commentList.forEach((comment) => {
          if (!this.commentUsers[comment.from.Id]) {
            this.fetchCommentUserById(comment.from.Id);
          }
        })
      })
    },
    fetchCommentUserById(id) {
      Vue.$http.get(`/Employees/${id}?fields=company,user`).then((response) => {
        Vue.set(this.commentUsers, `${id}`, response.data);
      })
    },
    fetchLatestArticleList() {
      const mallId = localStorage.getItem('mallId');
      Vue.$http.get(`${process.env.apiMall}/community/lists`, {
        params: {
          mallId: mallId,
          singlePage: 5
        }
      }).then((response) => {
        this.latestList = response.data;
      })
    },
    dellTopic() {
      this.$confirm('您是否确认删除该话题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Vue.$http.delete(`${process.env.apiMall}/community/delete`, {
            params: {
              topicId: this.topicId,
              identity: this.meId
            }
          }).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.$router.push({name: 'mall.topic.list'});
          }).catch((error)=>{
            this.$message({
              type: 'error',
              message: error.response.data.Message
            });
          });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    getAvatar(user) {
      if (user.UserId) {
        return user.User.PortraitUrl;
      }
      return '';
    },
    showReplyForm(comment) {
      this.currentReply = comment;
    },
    hideReplyForm() {
      this.currentReply = {};
    }
  },
  watch: {
    topicId() {
      this.fetchArticle();
      this.fetchArticleComments();
    }
  }
};

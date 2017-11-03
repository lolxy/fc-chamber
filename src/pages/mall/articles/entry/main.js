import Vue from 'vue';

export default {
  name: 'mall-article-entry',
  data() {
    return {
      entry: {},
      latestList: []
    }
  },
  computed: {
    entryId() {
      return this.$store.state.route.params.entryId;
    },
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  mounted() {
    this.fetchArticle();
    this.readArticle();
    this.fetchLatestArticleList();
  },
  methods: {
    fetchArticle() {
      Vue.$http.get(`${process.env.apiMall}/news/show`, {
        params: {
          newsId: this.entryId
        }
      }).then((response) => {
        this.entry = response.data;
      })
    },
    dellArticle() {
      this.$confirm('您是否确认删除该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Vue.$http.delete(`${process.env.apiMall}/news/delete`, {
            params: {
              newsId: this.entryId,
              identity:this.meId
            }
          }).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.$router.push({name: 'mall.article.list'});
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
    readArticle() {
      Vue.$http.get(`${process.env.apiMall}/news/read`, {
        params: {
          newsId: this.entryId
        }
      })
    },
    fetchLatestArticleList() {
      const mallId = localStorage.getItem('mallId');
      Vue.$http.get(`${process.env.apiMall}/news/lists`, {
        params: {
          mallId: mallId,
          singlePage: 5
        }
      }).then((response) => {
        this.latestList = response.data;
      })
    }
  },
  watch: {
    entryId() {
      this.fetchArticle();
    }
  }
};

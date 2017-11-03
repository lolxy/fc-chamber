import Vue from 'vue';

export default {
  name: 'cham-article-entry',
  data() {
    return {
      entry: {},
      typeOptions:[
        {
          value: 'news',
          label: '商会资讯'
        }, {
          value: 'law',
          label: '法律政策'
        }, {
          value: 'tec',
          label: '新技术'
        }
      ],
      latestList: [],
      currentModule:'news',
      allCategoryLists:[]
    }
  },
  computed: {
    entryId() {
      return this.$store.state.route.params.entryId;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  mounted() {
    this.fetchArticle();
    this.readArticle();
    this.fetchAllCatgory();
  },
  methods: {
    fetchAllCatgory() {
      Vue.$http.get(`${process.env.apiCham}/category/lists`, {
        params: {
          commerceChamberId: this.chamId,
          type:''
        }
      }).then((response) => {
        this.allCategoryLists = response.data;
      })
    },
    getModuleName(type) {
      const currentType=this.typeOptions.filter((item) => item.value === type);
      return currentType[0].label;
    },
    getCategroyName(catId) {
      if(this.allCategoryLists.length){
        const currentCategroy=this.allCategoryLists.filter((item) => item.id === catId);
        return currentCategroy[0].categoryName;
      }
    },
    fetchArticle() {
      Vue.$http.get(`${process.env.apiCham}/news/show`, {
        params: {
          newsId: this.entryId
        }
      }).then((response) => {
        this.entry = response.data;
        this.currentModule = this.entry.type;
        this.fetchLatestArticleList()
      })
    },
    dellArticle() {
      this.$confirm('您是否确认删除该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            Vue.$http.delete(`${process.env.apiCham}/news/delete`, {
              params: {
                newsId: this.entryId,
                identity:this.meId
              }
            }).then((response) => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.$router.push({name: 'cham.article.list'});
            }).catch((error)=>{
            this.$message({
              type: 'error',
              message: error.response.data.Message
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    readArticle() {
      Vue.$http.get(`${process.env.apiCham}/news/read`, {
        params: {
          newsId: this.entryId
        }
      })
    },
    fetchLatestArticleList() {
      const chamId = localStorage.getItem('chamId');
      Vue.$http.get(`${process.env.apiCham}/news/lists`, {
        params: {
          commerceChamberId: chamId,
          singlePage: 5,
          type:this.currentModule
        }
      }).then((response) => {
        this.latestList = response.data;
      })
    }
  },
  watch: {
    entryId() {
      this.fetchArticle();
      this.fetchAllCatgory();
    }
  }
};

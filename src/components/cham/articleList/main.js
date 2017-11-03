import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';
import categoryList from '@/components/cham/categoryList/main.vue';

export default {
  data() {
    return {
      list: [],
      currentPage: 0,
      allCategoryLists:[],
      currentCategory:[],
      currentCatId:null
    }
  },
  props: ['currentModule'],
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  components: {
    InfiniteLoading,
    categoryList,
    placeholder: require('@/components/placeholder/item.vue')
  },
  mounted() {
    this.fetchAllCatgory()
  },
  methods: {
    fetchArticleList(type,catId) {
      let chamId = localStorage.getItem('chamId');

      if (this.chamId) {
        chamId = this.chamId;
      }

      const listParams = {
        commerceChamberId:chamId,
        singlePage: 10,
        type: type,
        categoryId:catId,
        page: this.currentPage,
      };

      Vue.$http.get(`${process.env.apiCham}/news/lists`, {
        params: listParams,
      }).then((response) => {
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
      this.fetchArticleList(this.currentModule,this.currentCatId);
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
    },
    fetchAllCatgory() {
      Vue.$http.get(`${process.env.apiCham}/category/lists`, {
        params: {
          commerceChamberId: this.chamId,
          type:''
        }
      }).then((response) => {
        this.allCategoryLists = response.data;
        this.initCurrentPageList(this.currentModule);
      })
    },
    initCurrentPageList(type) {
      this.currentCategory=this.allCategoryLists.filter((item) => item.type === type);
    },
    getCurrentPageList(type) {
      this.currentCatId=null;
      this.$refs.categorylist.currentCatId=null;
      this.currentCategory=this.allCategoryLists.filter((item) => item.type === type);
      this.reloadList();
    },
    getCurrentCatArticleList(data) {
      this.currentCatId=data;
      this.reloadList();
    }
  }
};

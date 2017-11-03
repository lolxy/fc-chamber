import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      list: [],
      categories: [],
      currentCategory: 'featured',
      viewHistoryList: [],
      filters: {},
      currentPage: 0,
      isTop: true,
      errorImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTNCRkE1RkQxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTNCRkE1RkUxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGQTVGQjFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGQTVGQzFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjAWWV4AAAANSURBVHjaY2BgYOAFAAASAA4rpYR1AAAAAElFTkSuQmCC',
      loadingImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTNCRkE1RkQxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTNCRkE1RkUxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGQTVGQjFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGQTVGQzFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjAWWV4AAAANSURBVHjaY2BgYOAFAAASAA4rpYR1AAAAAElFTkSuQmCC'
    }
  },
  components: {
    InfiniteLoading,
    vLayout: require('@/layouts/default/default.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    route() {
      return this.$store.state.route;
    }
  },
  mounted() {
    this.fetchCats();
    
    if (this.route.params.categoryId) {
      this.currentCategory = this.route.params.categoryId;
      if (this.route.params.categoryId !== 'featured') {
        this.isTop = false;
      }
    }
    if (this.auth) {
      this.fetchArticleViewHistory();
    }
  },
  methods: {
    fetchCats() {
      Vue.$http.get('/PlatformArticles/PlatformArticleCategory/List?IsApp=true').then((response) => {
        this.categories = _.sortBy(response.data, item => item.Sort);
      });
    },
    fetchList() {
      const listParams = {
        take: 12,
        isTop: this.isTop,
        fields: 'PlatformArticleCategory,PlatformArticleAlbum,Type',
        skip: this.currentPage * 12,
      };

      if (this.currentCategory !== 'featured') {
        listParams['categoryId'] = this.currentCategory;
      }

      Vue.$http.get('/PlatformArticles/PlatformArticle/List', {
        params: listParams,
      }).then((response) => {
        let list = response.data;

        if (list.length) {
          this.list = this.list.concat(list);
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (list.length < 12) {
            this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentPage = this.currentPage + 1;
        } else {
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    fetchArticleViewHistory() {
      Vue.$http.get('/PlatformArticles/PlatformArticleRecord', {
        params: {
          take: 6,
          OrderBy: 'updatetime',
          fields: 'PlatformArticle,PlatformArticle.PlatformArticleAlbum'
        },
      }).then((response) => {
        this.viewHistoryList = response.data;
      });
    },
    onListInfinite() {
      this.fetchList();
    },
    reloadList() {
      this.list = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    formatCover(image) {
      let imgSrc = image;
      if (imgSrc.startsWith('http:')) {
        imgSrc = imgSrc.substring(5);
      }
      return {
        src: imgSrc,
        error: this.errorImg,
        loading: this.loadingImg
      }
    }
  },
  watch: {
    route(nVal, oVal) {
      this.reloadList();
      if (nVal.params.categoryId) {
        this.currentCategory = nVal.params.categoryId;
      }
    },
  }
};

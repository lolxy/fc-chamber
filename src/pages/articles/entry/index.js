import Vue from 'vue';

export default {
  data() {
    return {
      list: [],
      categories: [],
      viewHistoryList: [],
      entry: {},
      filters: {},
      currentPage: 0,
      errorImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTNCRkE1RkQxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTNCRkE1RkUxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGQTVGQjFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGQTVGQzFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjAWWV4AAAANSURBVHjaY2BgYOAFAAASAA4rpYR1AAAAAElFTkSuQmCC',
      loadingImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTNCRkE1RkQxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTNCRkE1RkUxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGQTVGQjFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGQTVGQzFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjAWWV4AAAANSURBVHjaY2BgYOAFAAASAA4rpYR1AAAAAElFTkSuQmCC'
    }
  },
  components: {
    vLayout: require('@/layouts/default/default.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    route() {
      return this.$store.state.route;
    },
    entryId() {
      return this.route.params.entryId;
    },
  },
  mounted() {
    this.fetchCats();
    this.fetchArticleById();
    if (this.auth) {
      this.fetchArticleViewHistory();
    }
  },
  methods: {
    addArticleRecord() {
      Vue.$http.post('/PlatformArticles/PlatformArticleRecord', {
        OwnerId: this.entry.OwnerId,
        PlatformArticleId: this.entry.Id
      });
    },
    fetchCats() {
      Vue.$http.get('/PlatformArticles/PlatformArticleCategory/List?IsApp=true').then((response) => {
        this.categories = _.sortBy(response.data, item => item.Sort);
      });
    },
    fetchArticleById() {
      Vue.$http.get(`/PlatformArticles/PlatformArticle/${this.entryId}?fields=Contents`).then((response) => {
        this.entry = response.data;
        if (this.auth) {
          this.addArticleRecord();
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
    formatCover(image) {
      return {
        src: image,
        error: this.errorImg,
        loading: this.loadingImg
      }
    },
    formatContent(content) {
      const ctx = content.replace(/ style="[^"]*"/g, '');
      return ctx;
    }
  },
  watch: {
    entryId() {
      this.fetchArticleById();
      if (this.auth) {
        this.fetchArticleViewHistory();
      }
    }
  }
};

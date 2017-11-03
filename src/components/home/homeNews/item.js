/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      activePanel: 'featured',
      articleCats: [],
      articleList: [],
      currentCategory: null,
      isFeatured: true
    }
  },
  components: {
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    this.fetchArticleCats();
    this.fetchArticleList();
  },
  methods: {
    fetchArticleCats() {
      Vue.$http.get('/PlatformArticles/PlatformArticleCategory/List?IsApp=true&OrderBy=Sort_asc').then((response) => {
        this.articleCats = response.data;
      });
    },
    fetchArticleList() {
      const listParams = {
        take: 4,
        isTop: this.isFeatured,
        fields: 'PlatformArticle,PlatformArticleCategory,PlatformArticleAlbum,Type'
      };

      if (this.currentCategory !== 'featured') {
        listParams['categoryId'] = this.currentCategory;
      }

      Vue.$http.get('/PlatformArticles/PlatformArticle/List', {
        params: listParams,
      }).then((response) => {
        this.articleList = response.data;
      });
    },
    handleClick(tab) {
      this.currentCategory = tab.name;
      this.reloadArticleList();
    },
    reloadArticleList() {
      this.fetchArticleList();
    },
    getArticleCover(gallery) {
      return gallery[0];
    },
    formatSrc(src) {
      let imgSrc = src;
      if (imgSrc.startsWith('http:')) { imgSrc = src.substring(5); }
      return imgSrc;
    },
  }
};

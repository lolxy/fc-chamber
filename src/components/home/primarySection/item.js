/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import authService from '@/services/auth';
import {popover} from 'element-ui';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      heros: [],
      articleList: [],
      user: {
        Account: null,
        Password: null,
        RememberMe: false,
      },
      heroSwiperOptions: {
        loop: true,
        autoplay: 6000,
        prevButton:'.hero-swiper-btn-prev',
        nextButton:'.hero-swiper-btn-next',
        pagination : '.hero-swiper-pagination',
        paginationClickable :true
      },
      articleSwiperOptions: {
        loop: true,
        autoplay: 6000,
        slidesPerView: 2,
        spaceBetween: 10,
        prevButton:'.article-swiper-btn-prev',
        nextButton:'.article-swiper-btn-next'
      }
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    elPopover: popover,
    swiper,
    swiperSlide,
    companyMenu: require('@/components/home/homeCompanyMenu/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    cIdentity() {
      const meId = localStorage.getItem('meId');
      const cIdentity = this.$store.state.myIdentities.list.filter(item => item.Id === meId);
      if (cIdentity.length) {
        return cIdentity[0];
      }
      return {};
    },
    myProfile() {
      return this.$store.state.myProfile.info;
    },
  },
  mounted() {
    this.fetchHeros();
    this.fetchLatestNews();
  },
  methods: {
    login(user) {
      authService.login(user);
    },
    goToPage(pageName) {
      store.dispatch('contact/toggleContactPanel', false);
      this.$router.push({ name: pageName });
    },
    fetchHeros() {
      Vue.$http.get('/IndexPages/Banner/List').then((response) => {
        this.heros = response.data;
      });
    },
    fetchLatestNews() {
      Vue.$http.get('/PlatformArticles/PlatformArticle/List?CategoryId=1224838a-e04f-e711-80e4-da42ba972ebd', {
        params: {
          Take: 6,
          IsTop: true,
          Fields: 'PlatformArticleAlbum'
        }
      }).then((response) => {
        let articleList = response.data;
        articleList = articleList.filter(item => item.PlatformArticleAlbum.length);
        this.articleList = articleList;
      });
    },
    getArticleCover(gallery) {
      return gallery[0];
    },
    formatImageSrc(src) {
      let imgSrc = src;

      if (imgSrc.startsWith('http:')) {
        imgSrc = imgSrc.substring(5);
      }
      return `${imgSrc}`;
    },
    openDownloadPage() {
      window.open('//www.fccn.cc/app','_blank');
    }
  },
};

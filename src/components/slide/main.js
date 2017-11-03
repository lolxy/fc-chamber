/* ============
 * Header
 * ============
 */
import Vue from 'vue';
import store from '@/store';
import authService from '@/services/auth';
import VueAwesomeSwiper from 'vue-awesome-swiper';
Vue.use(VueAwesomeSwiper)

export default {
  data() {
    return {
      swiperOption: {
        loop: true,
        autoplay: 6000,
        pagination : '.swiper-pagination',
        paginationClickable :true,
        autoplayDisableOnInteraction : false
      },
      newSwiperOption:{
        loop: true,
        autoplay: 4000,
        direction : 'vertical',
        mousewheelControl : true,
        autoplayDisableOnInteraction : false
      },
      bannerList:[],
      newsList:[]
    }
  },
  computed:{
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId
    }
  },
  mounted() {
    this.fetchBanner();
    this.fetchRecomNewsList();
  },
  methods: {
    fetchBanner() {
      Vue.$http.get(`${process.env.apiCham}/banner/lists`, {
        params:{
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.bannerList = response.data;
      });
    },
    fetchRecomNewsList() {
      Vue.$http.get(`${process.env.apiCham}/news/promote`, {
        params:{
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.newsList = response.data;
      });
    }
  }
};

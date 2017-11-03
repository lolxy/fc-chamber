/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      latestCompanySwiperItems: [],
      latestCompanyOptions: {
        loop: true,
        autoplay: 2000,
        loopedSlides: 14,
        slidesPerView: 'auto',
        autoplayDisableOnInteraction: false
      },
    }
  },
  components: {
    swiper,
    swiperSlide,
  },
  mounted() {
    this.fetchLatestCompany();
  },
  methods: {
    fetchLatestCompany() {
      Vue.$http.get('/Companies', {
        params: {
          Take: 12
        }
      }).then((response) => {
        this.latestCompanySwiperItems = response.data;
      });
    },
  }
};

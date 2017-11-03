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
      companyList: [],
      companySwiperOptions: {
        loop: true,
        autoplay: 4000,
        slidesPerView: 6,
        spaceBetween: 20,
        prevButton: '.companySwiper-button-prev',
        nextButton: '.companySwiper-button-next',
        autoplayDisableOnInteraction: false
      },
    }
  },
  computed: {
    shuffleCompanyList() {
      return _.shuffle(this.companyList);
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    this.fetchCompany();
  },
  methods: {
    fetchCompany() {
      Vue.$http.get('IndexPages/IndexTop/List?Take=12&Skip=0', {
        params: {
          fields: 'Company'
        }
      }).then((response) => {
        this.companyList = response.data;
      });
    },
    formatSrc(src) {
      let imgSrc = src;
      if (imgSrc.startsWith('http:')) { imgSrc = src.substring(5); }
      return imgSrc;
    },
  }
};

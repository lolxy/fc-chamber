import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      list: [],
      swiperOptions: {
        loop: true,
        prevButton:'.chamAd-swiper-btn-prev',
        nextButton:'.chamAd-swiper-btn-next',
        pagination : '.chamAd-swiper-pagination',
        paginationClickable :true
      },
    }
  },
  props: [
    'items'
  ],
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  mounted() {
    this.list = this.items;
  },
  watch: {
    items(nVal, oVal) {
      this.list = this.items;
    }
  }
};

import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      list: [],
      swiperOptions: {
        loop: true,
        prevButton:'.mallAd-swiper-btn-prev',
        nextButton:'.mallAd-swiper-btn-next',
        pagination : '.mallAd-swiper-pagination',
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
    mallId() {
      return this.$store.state.route.params.mallId;
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

/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      product: {},
      productLoaded: false,
      gallery: [],
      swiperOption: {
        autoplay: 5000,
        autoHeight: true,
        loop: false,
        pagination: '.swiper-pagination',
        paginationClickable: true,
      }
    }
  },
  components: {
    swiper,
    swiperSlide,
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    this.fetchProduct();
  },
  methods: {
    isMyOwnCompany() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myCompanies.list.filter((item) => {
        return item.OwnerId === userId && item.Id === currentCompanyId;
      });
      if (myCompany.length) {
        return true;
      }
      return false;
    },
    fetchProduct() {
      const productId = this.$store.state.route.params.productId;
      Vue.$http.get(`../v1/Products/${productId}`, {
        params: {
          fields: 'Images',
        },
      })
      .then((response) => {
        this.product = response.data;
        this.productLoaded = true;
        this.initGallery(this.product.Images);
      })
      .catch((error) => {
        console.log(error);
      });
    },
    initGallery(images) {
      var self = this;

      let gallery = _.map(images, function(image, index) {

        delete image['Remark'];
        delete image['IsIndex'];

        _.set(image, 'src', `${image.OriginalPath}?imageView2/2/w/1200`);

        self.initImage(image, index);

        return Object.assign({}, image, { w: 0, h: 0 });
      });

      self.gallery = gallery;
    },
    initImage(image, index) {
      const img = new Image();
      const self = this;

      img.onload = function imageload() {
        self.gallery[index].w = 1200;
        self.gallery[index].h = 1200/(img.naturalWidth/img.naturalHeight);
      };
      img.src = image.OriginalPath;
    },
    galleryOptions(pid) {
      return {
        closeEl: false,
        captionEl: false,
        counterEl: false,
        fullscreenEl: false,
        shareEl: false,
        zoomEl: false,
        tapToClose: true,
        tapToToggleControls: false,
        mainClass: 'pswp--minimal--dark',
        barsSize: {top:0,bottom:0},
        getThumbBoundsFn() {
          // let thumbnail = $(`#${pid}`);
          // let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          // let rect = thumbnail[0].getBoundingClientRect();
          // return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
      }
    },
  }
};

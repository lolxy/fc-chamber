/* ============
 * Image Loader
 * ============
 *
 */

export default {
  data() {
    return {
      blankAvatar: '/static/img/avatar_blank.png',
      blankLogo: '/static/img/logo_blank.png',
      imgSrc: null,
      errorImg: false,
    }
  },
  props: [
    'src',
    'size',
    'mode'
  ],
  mounted() {
    this.imgSrc = this.src;
    this.getThumb(this.src, this.size);
  },
  methods: {
    getThumb(src, size) {
      var self = this;
      if (src) {
        let imgSrc = src;
        if (imgSrc.startsWith('http:')) {imgSrc = src.substring(5)}
        return `${imgSrc}?imageView2/1/w/100/h/100`;
      }
      if (this.mode === 'logo') {
        return this.blankLogo;
      }
      return this.blankAvatar;
    },
    imageLoadOnError() {
      this.errorImg = true;
    }
  },
};

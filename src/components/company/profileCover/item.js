/* ============
 * Image Loader
 * ============
 *
 */

export default {
  props: [
    'src',
    'width',
    'height',
  ],
  data() {
    return {
      onerror: false
    };
  },
  mounted() {
    const img = new Image();
    const self = this;

    img.onerror = () => {
      self.onerror = true;
    };

    img.src = self.getImage(self.src, self.width, self.height);
  },
  methods: {
    getImage(src, width, height) {
      if (src) {
        let imgSrc = src;
        if (imgSrc.startsWith('http:')) { imgSrc = src.substring(5); }
        return `${imgSrc}?imageView2/1/w/${width}/h/${height}`;
      }
      return `/static/img/profile_cover.jpg`;
    },
  },
};

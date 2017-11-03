/* ============
 * Image Loader
 * ============
 *
 */
import Vue from 'vue';

export default {
  props: [
    'id',
    'image',
    'index',
    'gallery',
    'thumbSize',
  ],
  mounted() {
    const self = this;
    const img = new Image();

    img.onload = () => {
      self.$emit('imageLoaded', {
        src: `${self.image.OriginalPath}?imageView2/0/q/75|watermark/1/image/aHR0cDovL2ZpbGVzLmZjY24uY2MvZnVjaGVuZ193YXRlcm1hcmsucG5n/dissolve/90/gravity/SouthEast/dx/10/dy/10|imageslim`,
        w: 1000,
        h: 1000/(img.naturalWidth/img.naturalHeight)
      });
    };
    img.src = self.getThumb(self.image, self.thumbSize);
  },
  methods: {
    getThumb(image, size) {
      let imgSrc = image.OriginalPath;

      if (imgSrc.startsWith('http:')) {
        imgSrc = imgSrc.substring(5);
      }
      return `${imgSrc}?imageMogr2/thumbnail/${size}x`;
    },
    galleryOptions(pid) {
      return {
        shareEl: false,
        showHideOpacity: true,
        getThumbBoundsFn() {
          let thumbnail = $(`#${pid}`);
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail[0].getBoundingClientRect();
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
      }
    },
    getImageMeta(e) {
      const self = this;
      const img = new Image();

      img.onload = () => {
        self.$emit('imageLoaded', {
          src: `${self.image.OriginalPath}?imageView2/0/q/75|watermark/1/image/aHR0cDovL2ZpbGVzLmZjY24uY2MvZnVjaGVuZ193YXRlcm1hcmsucG5n/dissolve/90/gravity/SouthEast/dx/10/dy/10|imageslim`,
          w: 1000,
          h: 1000/(img.naturalWidth/img.naturalHeight)
        });

        setTimeout(() => {
          self.$preview.open(self.index, self.gallery, self.galleryOptions(`preview-img-${self.id}_${self.index}`));
        }, 300);
        
      };
      img.src = self.getThumb(self.image, self.thumbSize);
    }
  },
};

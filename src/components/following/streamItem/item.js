/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      galleries: {}
    }
  },
  props: [
    'item',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    productItem: require('./tmpl/product/item.vue'),
    marketItem: require('./tmpl/market/item.vue'),
    auctionItem: require('./tmpl/auction/item.vue'),
    biddingItem: require('./tmpl/bidding/item.vue'),
  },
  computed: {
    getCategory() {
      return _.filter(this.item.RelObj.Company.Categories, category => category.TypeId == '07154e16-de57-e611-b281-a00b61b73b60');
    },
    getIndustry() {
      return _.filter(this.item.RelObj.Company.Categories, industry => industry.TypeId == '4d2d281e-de57-e611-b281-a00b61b73b60');
    },
  },
  methods: {
    onImageLoaded(image, itemId) {
      if (!this.galleries[`gallery${itemId}`]) {
        Vue.set(this.galleries, `gallery${itemId}`, [image]);
      } else {
        this.galleries[`gallery${itemId}`].push(image);
      }
    },
  }
};

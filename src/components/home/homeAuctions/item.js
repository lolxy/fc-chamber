/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import VueCountdown2 from 'vue-countdown-2';

export default {
  data() {
    return {
      activePanel: 'featured',
      auctionsCats: [],
      auctionsList: [],
      currentCategory: null,
      isFeatured: true
    }
  },
  computed: {
    auctionsListGroup() {
      return _.chunk(this.auctionsList, 4);
    }
  },
  components: {
    VueCountdown2,
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    this.fetchAuctionsCats();
    this.fetchAuctionsList();
  },
  methods: {
    fetchAuctionsCats() {
      Vue.$http.get('../v1/AuctionCategoryTypes').then((response) => {
        this.types = _.sortBy(response.data, item => item.Ordering).reverse();
      });
    },
    fetchAuctionsList() {
      const listParams = {
        fields: 'CurrPrice,Publisher,Images,Company',
        take: 8
      };

      if (this.currentCategory !== 'featured') {
        listParams['categoryId'] = this.currentCategory;
      }

      Vue.$http.get('../v1/Auctions', {
        params: listParams,
      }).then((response) => {
        this.auctionsList = response.data;
      });
    },
    handleClick(tab) {
      this.currentCategory = tab.name;
      this.reloadAuctionsList();
    },
    reloadAuctionsList() {
      this.fetchAuctionsList();
    },
    isEnded(time) {
      const endTime = new Date(time).getTime();
      if (this.currentTime > endTime) {
        return true;
      }
      return false;
    },
    formatPrice(price) {
      let priceValue = price.toString();
      const ifInfinite = priceValue.indexOf('e');
      if (ifInfinite !== -1) {
        priceValue = priceValue.slice(0, ifInfinite);
        priceValue = Math.round(priceValue * 100) / 100;
      }
      return priceValue;
    },
    formatSrc(src) {
      let imgSrc = src;
      if (imgSrc.startsWith('http:')) { imgSrc = src.substring(5); }
      return imgSrc;
    },
  }
};

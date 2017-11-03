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
      biddingsCats: [],
      biddingsList: [],
      currentCategory: null,
      isFeatured: true
    }
  },
  computed: {
    biddingsListGroup() {
      return _.chunk(this.biddingsList, 4);
    }
  },
  components: {
    VueCountdown2,
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    this.fetchBiddingsCats();
    this.fetchBiddingsList();
  },
  methods: {
    fetchBiddingsCats() {
      Vue.$http.get('../v1/AuctionCategoryTypes').then((response) => {
        this.types = _.sortBy(response.data, item => item.Ordering).reverse();
      });
    },
    fetchBiddingsList() {
      const listParams = {
        fields: 'CurrPrice,Publisher,Images,Company',
        take: 8
      };

      if (this.currentCategory !== 'featured') {
        listParams['categoryId'] = this.currentCategory;
      }

      Vue.$http.get('../v1/Biddings', {
        params: listParams,
      }).then((response) => {
        this.biddingsList = response.data;
      });
    },
    handleClick(tab) {
      this.currentCategory = tab.name;
      this.reloadBiddingsList();
    },
    reloadBiddingsList() {
      this.fetchBiddingsList();
    },
    isEnded(time) {
      const endTime = new Date(time).getTime();
      if (this.currentTime > endTime) {
        return true;
      }
      return false;
    },
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    },
    formatPrice(price) {
      if (price) {
        let priceValue = price.toString();
        const hasDecimal = priceValue.indexOf('.');
        const ifInfinite = priceValue.indexOf('e');
        if (hasDecimal && ifInfinite !== -1) {
          priceValue = priceValue.slice(0, ifInfinite);
          priceValue = Math.round(priceValue * 100) / 100;
        }
        if (hasDecimal) {
          priceValue = Math.round(priceValue * 100) / 100;
        }
        return priceValue;
      }
      return '';
    },
    formatSrc(src) {
      let imgSrc = src;
      if (imgSrc.startsWith('http:')) { imgSrc = src.substring(5); }
      return imgSrc;
    },
  }
};

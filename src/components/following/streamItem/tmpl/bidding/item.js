import VueCountdown2 from 'vue-countdown-2';

export default {
  props: [
    'item',
  ],
  components: {
    VueCountdown2,
  },
  methods: {
    isEnded(time) {
      const endTime = new Date(time).getTime();
      if (this.currentTime > endTime) {
        return true;
      }
      return false;
    },
    formatPrice(price) {
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
    },
  }
};

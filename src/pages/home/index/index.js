/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

export default {
  name: 'home-page',
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    VFooter: require('@/components/footer/item.vue'),
    primarySection: require('@/components/home/primarySection/item.vue'),
    latestCompanies: require('@/components/home/latestCompanies/item.vue'),
    recommendedCompanies: require('@/components/home/recommendedCompanies/item.vue'),
    homeNews: require('@/components/home/homeNews/item.vue'),
    homeMarketStream: require('@/components/home/homeMarketStream/item.vue'),
    homeAuctions: require('@/components/home/homeAuctions/item.vue'),
    homeBiddings: require('@/components/home/homeBiddings/item.vue'),
  }
};

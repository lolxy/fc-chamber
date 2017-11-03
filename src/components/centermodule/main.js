/* ============
 * Header
 * ============
 */

import Vue from 'vue'
import store from '@/store';
import authService from '@/services/auth';
import electronicMall from '@/components/electronicmall/main.vue';
import brandEnterprise from '@/components/brandenterprise/main.vue';
import newsList from '@/components/newslist/main.vue';

export default {
  data() {
    return {

    }
  },
  components: {
    electronicMall,
    brandEnterprise,
    newsList
  }
};

/* ============
 * Header
 * ============
 */

import Vue from 'vue'
import store from '@/store';
import authService from '@/services/auth';
import slide from '@/components/slide/main.vue';
import news from '@/components/news/main.vue';

export default {
  data() {
    return {

    }
  },
  components: {
    slide,
    news
  }
};

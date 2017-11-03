/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

export default {
  name: 'home-page',
  data() {
    return {
      url:`${process.env.baseUrl}`
    }
  },
  mounted() {
    window.location.href = this.url;
  }
};

/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

export default {
  data() {
    return {
      notFound: false
    }
  },
  mounted() {
    const productId = this.$store.state.route.params.productId;
    Vue.$http.get(`../v1/Products/${productId}`).then((response) => {
      const companyId = response.data.CompanyId;
      window.location.href = `/company/${companyId}/product/${productId}`;
    }).catch((error) => {
      this.notFound = true;
    })
  }
};

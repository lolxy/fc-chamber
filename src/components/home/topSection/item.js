/* =================
 * Home top section
 * =================
 *
 */
import store from '@/store';

export default {
  data() {
    return {
      articleList: [],
      searchKeyword: null,
    }
  },
  components: {
  },
  methods: {
    searchCompany() {
      this.$router.push({ name: 'companies', query: { keyword: this.searchKeyword }});
    }
  },
};

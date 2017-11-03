/* ============
 * Header
 * ============
 */
import Vue from 'vue';
import store from '@/store';
import authService from '@/services/auth';

export default {
  data() {
    return {
      siteList:[],
      baseUrl:`${process.env.baseUrl}/company`
    }
  },
  computed:{
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  mounted() {
    this.fetchSiteList();
  },
  methods: {
    fetchSiteList() {
      Vue.$http.get(`${process.env.apiCham}/sites/promoteLists`, {
        params:{
          commerceChamberId: this.chamId,
          page:0,
          singlePage:8
        }
      }).then((response)=>{
        this.siteList = response.data;
      });
    },
    getCompanyLogo(companyInfo) {
      if (companyInfo && companyInfo.LogoUrl) {
        return companyInfo.LogoUrl
      }
      return null
    }
  }
};

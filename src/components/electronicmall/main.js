/* ============
 * Header
 * ============
 */
import Vue from 'vue'
import store from '@/store';
import authService from '@/services/auth';

export default {
  data() {
    return {
      companyList:[],
      baseUrl:`${process.env.baseUrl}/company`
    }
  },
  computed:{
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.id
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  mounted() {
    this.fetchCompanyList();
  },
  methods: {
    fetchCompanyList() {
      Vue.$http.get(`${process.env.apiCham}/memberAd/lists`, {
        params:{
          commerceChamberId: this.chamId,
          page:0,
          singlePage:8
        }
      }).then((response)=>{
        this.companyList = response.data;
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

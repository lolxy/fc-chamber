/* ============
 * Header
 * ============
 */
import Vue from 'vue';
import store from '@/store';
import authService from '@/services/auth';
import Vuebar from 'vuebar';
Vue.use(Vuebar);

export default {
  data() {
    return {
      newslist:[],
      noticelist:[]
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
  mounted() {
    this.fetchRecomNewsList();
    this.fetchNotice();
  },
  methods: {
    fetchRecomNewsList() {
      Vue.$http.get(`${process.env.apiCham}/news/promote`, {
        params:{
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.newslist = response.data;
      });
    },
    fetchNotice(){
      Vue.$http.get(`${process.env.apiCham}/notice/lists`, {
        params:{
          commerceChamberId: this.chamId,
          type:"",
          page:0,
          singlePage:10
        }
      }).then((response)=>{
        this.noticelist = response.data;
      });
    }
  }
};

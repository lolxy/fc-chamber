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
      newsList:[],
      lawList:[],
      newTecList:[]
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
  mounted() {
    this.fetchNewsList();
    this.fetchLawList();
    this.fetchNewTecList();
  },
  methods: {
    fetchNewsList() {
      Vue.$http.get(`${process.env.apiCham}/news/lists`, {
        params:{
          commerceChamberId: this.chamId,
          type:"news",
          page:0,
          singlePage:5,
          filter:"top"
        }
      }).then((response)=>{
        this.newsList = response.data;
      });
    },
    fetchLawList() {
      Vue.$http.get(`${process.env.apiCham}/news/lists`, {
        params:{
          commerceChamberId: this.chamId,
          type:"law",
          page:0,
          singlePage:5,
          filter:"top"
        }
      }).then((response)=>{
        this.lawList = response.data;
      });
    },
    fetchNewTecList() {
      Vue.$http.get(`${process.env.apiCham}/news/lists`, {
        params:{
          commerceChamberId: this.chamId,
          type:"tec",
          page:0,
          singlePage:5,
          filter:"top"
        }
      }).then((response)=>{
        this.newTecList = response.data;
      });
    }
  }
};

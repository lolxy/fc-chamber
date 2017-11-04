import Vue from 'vue';
import store from '@/store';
import authService from '@/services/auth';

export default {
  data() {
    return {
      chamInfo:null,
      searchKeyword:'',
      baseUrl:`${process.env.baseUrl}`
    }
  },
  computed:{
    auth() {
      return this.$store.state.auth.authenticated;
    },
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId
    },
    userName() {
      return this.$store.state.myProfile.info.UserName
    }
  },
  mounted() {
    this.fetchChamInfo();
  },
  methods: {
    fetchChamInfo() {
      Vue.$http.get(`${process.env.apiCham}/commerceChamber/getCommerceChamberDetail`, {
        params:{
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.chamInfo = response.data;
      });
    },
    searchCompany() {
      if(this.searchKeyword){
        this.$router.push({ name: 'chamber.search', params: { chamId:this.chamId }, query:{keyword: this.searchKeyword }});
      }else{
        this.$message(
          {
            message:'搜索关键字不能为空！',
            type:'warning'
          });
      }
    }
  }
};

import Vue from 'vue';

export default {
  name: 'chamber-search-list',
  data() {
    return {
      memberList: [],
      noresult:false
    }
  },
  components: {
    companyGrid: require('@/components/companyGrid/item.vue'),
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    keyword() {
      return this.$store.state.route.query.keyword;
    }
  },
  mounted() {
    this.fetchSearchResult(this.keyword);
  },
  watch:{
    keyword(){
      this.fetchSearchResult(this.keyword);
    }
  },
  methods: {
    fetchSearchResult(keyword){
      if(keyword){
        Vue.$http.get(`${process.env.apiCham}/commerceChamber/searchMember`,{
          params:{
            commerceChamberId:this.chamId,
            keyword:keyword
          }
        }).then((response) => {
          this.memberList = response.data;
          this.noresult = this.memberList.length?false:true;
        })
      }else{
        this.noresult=true;
      }
    }
  }
}

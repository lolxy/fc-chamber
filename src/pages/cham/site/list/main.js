import Vue from 'vue';

export default {
  name: 'cham-site-list',
  data() {
    return {
      siteList: [],
      hasData:true
    }
  },
  components: {
    siteRecommendGrid: require('@/components/cham/siteRecommendGrid/item.vue')
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  mounted() {
    this.fetchSiteList();
  },
  watch:{
    siteList() {
      this.hasData = this.siteList.length ? true:false;
    }
  },
  methods: {
    onChamSiteDeleted() {
      this.fetchSiteList();
    },
    fetchSiteList() {
      Vue.$http.get(`${process.env.apiCham}/sites/promoteLists`,{
        params:{
          commerceChamberId:this.chamId
        }
      }).then((response) => {
        this.siteList = response.data;
      })
    }
  }
};

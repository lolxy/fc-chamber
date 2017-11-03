import Vue from 'vue';

export default {
  name: 'organization',
  data() {
    return {
      organization:{}
    }
  },
  computed:{
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  mounted() {
    this.fetchChamberOrganization();
  },
  methods: {
    fetchChamberOrganization() {
      Vue.$http.get(`${process.env.apiCham}/posts/info`, {
        params:{
          type:'organization',
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.organization = response.data;
      });
    }
  }
}

import Vue from 'vue';

export default {
  data() {
    return {
      company: {},
      cham: {}
    }
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    profileHeader: require('@/components/company/profileHeader/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
    subnav: require('@/components/cham/subnav/main.vue'),
    chamProfile: require('@/components/cham/profile/main.vue'),
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    myCompanyId() {
      return localStorage.getItem('companyId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  methods: {
    fetchChamInfo() {
      Vue.$http.get(`${process.env.apiCham}/commerceChamber/getCommerceChamberWithCompanyId`, {
        params: {
          companyId: this.myCompanyId
        }
      }).then((response) => {
        this.cham = response.data;
        this.fetchCompanyById(this.cham.companyId);
      })
    },
    fetchCompanyById(id) {
      const meId = localStorage.getItem('meId');

      let params = {
        extRelate: `mk_cham_company_ref:${this.chamId}`,
        fields: 'Categories,HasProducts,ExtRelates.Properties'
      }

      if (this.auth) {
        params = {
          meId: localStorage.getItem('meId'),
          fields: 'Categories,HasProducts,RelationshipOfUs,ExtRelates.Properties'
        }
      }

      Vue.$http.get(`/Companies/${id}`, {params})
      .then((response) => {
        this.company = response.data;
      });
    }
  },
  mounted() {
    this.fetchChamInfo();
  }
};

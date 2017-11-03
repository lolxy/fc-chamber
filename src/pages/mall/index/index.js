import Vue from 'vue';

export default {
  data() {
    return {
      company: {},
      mall: {}
    }
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    profileHeader: require('@/components/company/profileHeader/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
    subnav: require('@/components/mall/subnav/main.vue'),
    mallProfile: require('@/components/mall/profile/main.vue'),
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  methods: {
    fetchMallInfo() {
      Vue.$http.get(`${process.env.apiMall}/mall/getMallDetail`, {
        params: {
          mallId: this.mallId
        }
      }).then((response) => {
        this.mall = response.data;
        this.fetchCompanyById(this.mall.companyId);
      })
    },
    fetchCompanyById(id) {
      const meId = localStorage.getItem('meId');

      let params = {
        extRelate: `mk_mall_company_ref:${this.mallId}`,
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
    this.fetchMallInfo();
  }
};

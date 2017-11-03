import Vue from 'vue';

export default {
  name: 'cham-apply-entry',
  data() {
    return {
      entry: {},
      latestList: [],
      chamName:''
    }
  },
  computed: {
    entryId() {
      return this.$store.state.route.params.entryId;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  mounted() {
    this.fetchapply();
    this.getChamName()
  },
  methods: {
    fetchapply() {
      Vue.$http.get(`${process.env.apiCham}/apply/show`, {
        params: {
          applyId:this.entryId,
          identity:this.meId
        }
      }).then((response) => {
        this.entry = response.data;
      }).catch((error) => {
        this.$notify.error({
          title: '对不起',
          message: `${error.response.data.Message}`,
          offset: 100
        });
      })
    },
    getChamName() {
      Vue.$http.get(`${process.env.apiCham}/commerceChamber/getCommerceChamberDetail`, {
        params: {
          commerceChamberId: this.chamId
        }
      }).then((response) => {
        this.chamName = response.data.name;
      })
    }
  },
  watch: {
    entryId() {
      this.fetchapply();
      this.getChamName()
    }
  }
};

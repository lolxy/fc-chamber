import Vue from 'vue';

export default {
  data() {
    return {
      list:[]
    }
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    },
    listType() {
      return this.isMyCham?"all":"";
    }
  },
  mounted() {
    this.fetchNoticeList();

  },
  watch:{
    listType(){
      this.fetchNoticeList();
    }
  },
  methods: {
    fetchNoticeList() {
      let chamId = localStorage.getItem('chamId');

      if (this.chamId) {
        chamId = this.chamId;
      }

      const listParams = {
        commerceChamberId:chamId,
        type:this.listType
      };

      Vue.$http.get(`${process.env.apiCham}/notice/lists`, {
        params: listParams,
      }).then((response) => {
        this.list = response.data;
      });
    }
  }
};

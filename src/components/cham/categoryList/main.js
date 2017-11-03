import Vue from 'vue';

export default {
  data() {
    return {
      currentCatId:null
    }
  },
  props: ['currentCategory'],
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  methods: {
    getCurrentCatArticleList(Id) {
      this.currentCatId=Id;
      this.$emit("onGetCurrentPageList",this.currentCatId);
    }
  }
};

import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'newlist',
  data() {
    return {
      list: [],
      currentPage: 0,
      currentCatList:[],
      currentCatId:null
    }
  },
  computed:{
    auth() {
      return this.$store.state.auth.authenticated;
    },
    routeName() {
      return this.$store.state.route.name;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    newType() {
      if(this.routeName == 'chamber.news'){
        return 'news';
      }else if(this.routeName == 'chamber.law'){
        return 'law';
      }else{
        return 'tec';
      }
    }
  },
  components: {
    InfiniteLoading,
    placeholder: require('@/components/placeholder/item.vue')
  },
  mounted() {
    this.getNewCatList(this.newType);
  },
  watch:{
    newType(){
      this.getNewCatList(this.newType);
      this.currentCatId = null;
      this.reloadList();
    }
  },
  methods: {
    fetchArticleList(type,catId) {
      const listParams = {
        commerceChamberId:this.chamId,
        singlePage: 10,
        type: type,
        categoryId:catId,
        page: this.currentPage,
      };

      Vue.$http.get(`${process.env.apiCham}/news/lists`, {
        params: listParams,
      }).then((response) => {
        let list = response.data;

        if (list.length) {
          this.list = this.list.concat(list);
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (list.length < 10) {
            this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentPage = this.currentPage + 1;
        } else {
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    onListInfinite() {
      this.fetchArticleList(this.newType,this.currentCatId);
    },
    reloadList() {
      this.list = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    getNewCatList(newType) {
      Vue.$http.get(`${process.env.apiCham}/category/lists`, {
        params:{
          type:newType,
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.currentCatList = response.data;
      });
    },
    getCurrentCatId(id){
      this.currentCatId = id;
      this.reloadList();
    },
    backtop() {
      $("body,html").animate({scrollTop:0},500);
    }
  }
}

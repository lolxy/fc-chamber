/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';

export default {
  props: [
    'item',
    'type',
    'gallery',
    'checkFavoriteJson'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    imageItem: require('@/components/stream/streamImage/item.vue'),
    commentItem: require('@/components/stream/commentItem/item.vue'),
  },
  computed: {
    meId() {
      return localStorage.getItem('meId');
    },
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId() {
      return this.$store.state.myProfile.info.Id;
    },
    getCategory() {
      return _.filter(this.item.Sender.Company.Categories, category => category.TypeId == '07154e16-de57-e611-b281-a00b61b73b60');
    },
    getIndustry() {
      return _.filter(this.item.Sender.Company.Categories, industry => industry.TypeId == '4d2d281e-de57-e611-b281-a00b61b73b60');
    },
    getStreamCats() {
      return _.filter(this.item.Categories, cats => cats.TypeId == 'fc696a99-3702-e711-80e3-850a1737545e');
    }
  },
  methods: {
    deleteThisStream(itemId) {
      this.$confirm(`确定删除该动态吗?`, '删除动态', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`/MarketTalks/${itemId}`).then(() => {
          this.$emit('deleteStream', itemId);
          this.$notify({
            type: 'success',
            title: '删除成功',
            message: '成功删除了一条动态',
            offset: 50,
          });
        });
      }).catch(() => {});
    },
    onImageLoaded(meta, index) {
      this.$emit('imageLoaded', {
        image: meta,
        index: index
      });
    },
    insertSession(accid) {
      const self = this;
      window.nim.insertLocalSession({
        scene: 'p2p',
        to: accid,
        done(error, session) {
          store.dispatch('nim/switchNimCurrentSession', `p2p-${accid}`);
          store.dispatch('contact/switchContactPanel', 'contact.sessions');
          store.dispatch('contact/toggleContactPanel', true);
        }
      });
    },
    addFavorite(marketId){
      Vue.$http.post(`/MemberFavorites/Add`,{
        RelType:'CompanyTalk',
        RelId:marketId
      }).then((response) => {
        Vue.set(this.checkFavoriteJson[marketId],'isFavorite',true);
        Vue.set(this.checkFavoriteJson[marketId],'favoriteId',response.data[0].Id);
      }).catch((error)=>{
        this.$notify({
          type: 'error',
          title: '收藏失败',
          message: error.response.data.Message,
          offset: 50,
        });
      });
    },
    removeFavorite(marketId,favoriteId){
      Vue.$http.delete(`/MemberFavorites/${favoriteId}`).then(() => {
        Vue.set(this.checkFavoriteJson[marketId],'isFavorite',false);
        Vue.delete(this.checkFavoriteJson[marketId],'favoriteId');
      }).catch((error)=>{
        this.$notify({
          type: 'error',
          title: '取消收藏失败',
          message: error.response.data.Message,
          offset: 50,
        });
      });
    }
  },
};

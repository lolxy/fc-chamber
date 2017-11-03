import Vue from 'vue';
import VueDND from 'awe-dnd';
Vue.use(VueDND);

export default {
  props: [
    'items'
  ],
  mounted() {
    this.$dragging.$on('dragged', ({ value }) => {
      value.list.forEach((item, index) => {
        this.updateAdOrder(item, index)
      })
    })
  },
  methods: {
    updateAdOrder(item, index) {
      Vue.$http.put(`${process.env.apiMall}/advertisement/modifyAdvertisement`, {
        advertisementId: item.id,
        mallId: item.mallId,
        imageId: item.imageId,
        identity: item.createIdentity,
        contentUrl: item.contentUrl,
        orange: index,
      });
    },
    deleteItem(item) {
      Vue.$http.delete(`${process.env.apiMall}/advertisement/deleteAdvertisement`, {
        params: {
          advertisementId: item.id,
          mallId: item.mallId,
          identity: item.createIdentity
        }
      }).then(() => {
        this.$emit('adListDeleted', item.id);
      })
    }
  }
};

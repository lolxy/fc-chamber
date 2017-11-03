/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

export default {
  data() {
    return {
      auctionComment: {
        AuctionId: null,
        SenderId: null,
        Price: 0,
        Message: null,
      },
    };
  },
  props: [
    'item',
  ],
  computed: {
    meId() {
      return localStorage.getItem('meId');
    },
  },
  methods: {
    onSubmit() {
      this.auctionComment.AuctionId = this.item.Id;
      this.auctionComment.SenderId = this.meId;

      Vue.$http.post('../v1/AuctionOffers', this.auctionComment).then((response) => {
        window.location.reload(true);
      }).catch((error) => {
        this.$notify({
          type: 'error',
          title: '操作失败',
          message: `${error.response.data.Message}`,
          offset: 50,
        });
      })
    },
    onClose() {
      this.$emit('close');
    }
  }
};

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
      biddingComment: {
        BiddingId: null,
        SenderId: null,
        Qty: 0,
        Price: 0,
        DeliveryTime: null,
        Message: null,
      },
      date: new Date()
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
      this.biddingComment.BiddingId = this.item.Id;
      this.biddingComment.SenderId = this.meId;

      Vue.$http.post('../v1/BiddingOffers', this.biddingComment).then((response) => {
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

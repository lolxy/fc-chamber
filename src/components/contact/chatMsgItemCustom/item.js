/* ============
 * Custom message item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';

export default {
  data() {
    return {
      addFriendDialogVisible: false,
      currEmployee: {},
      currRequestId: null,
      currentUserId: null,
      profileDialogVisible: false,
    };
  },
  props: [
    'message',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    userProfile: require('@/components/contact/userProfile/item.vue'),
    friendRequestItem: require('@/components/contact/friendRequestItem/item.vue'),
  },
  computed: {
    myCompanies() {
      return this.$store.state.myCompanies;
    },
  },
  methods: {
    parseMsg(message) {
      if (message.content) {
        const content = JSON.parse(message.content.replace(/,\r\n\s*}/g, '}'));
        if (typeof content === 'object') {
          return this.jsonLowerKeys(content);
        }
        return {};
      }
    },
    jsonLowerKeys(content) {
      let ret = {};
      $.map(content, (value, key) => {
        ret[key.toLowerCase()] = value;
      })
      return ret;
    },
    viewFriendRequest() {
      let currEmployeeId = this.parseMsg(this.message).data.employeeId;
      this.currRequestId = this.parseMsg(this.message).data.id;

      Vue.$http.get(`/Employees/${currEmployeeId}`, {
        params: {
          meId: localStorage.getItem('meId'),
          CompanyId: localStorage.getItem('companyId'),
          fields: 'User,Company,RelationshipOfUs',
        }
      }).then((response) => {
        this.currEmployee = response.data;
        this.addFriendDialogVisible = true;
      });
    },
    formatDate(date) {
      const dateTime = new Date(date);
      return `${dateTime.getFullYear()}年${dateTime.getMonth() + 1}月${dateTime.getDate()}日`;
    },
    formatPrice(price) {
      let priceValue = price.toString();
      const ifInfinite = priceValue.indexOf('e');
      if (ifInfinite !== -1) {
        priceValue = priceValue.slice(0, ifInfinite);
        priceValue = Math.round(priceValue * 100) / 100;
      }
      return priceValue;
    },
    openUserProfile(userId) {
      this.currentUserId = userId;
      this.profileDialogVisible = true;
    },
    openCompanyProfile(companyId) {
      this.$router.push({ name: 'company.profile', params: { id: companyId } });
      store.dispatch('contact/toggleContactPanel', false);
    },
    openCompanyProducts(companyId) {
      this.$router.push({ name: 'company.products', params: { id: companyId } });
      store.dispatch('contact/toggleContactPanel', false);
    },
    openAuctionsDetail(auctionId) {
      this.$router.push({ name: 'circles.auctions.detail', params: { id: auctionId } });
      store.dispatch('contact/toggleContactPanel', false);
    },
    openBiddingsDetail(biddingId) {
      this.$router.push({ name: 'circles.biddings.detail', params: { id: biddingId } });
      store.dispatch('contact/toggleContactPanel', false);
    },
    openTaskDetail(taskId) {
      this.$router.push({ name: 'worktasks.entry', params: { taskId: taskId } });
      store.dispatch('contact/toggleContactPanel', false);
    },
    openTaskList() {
      this.$router.push({ name: 'worktasks' });
      store.dispatch('contact/toggleContactPanel', false);
    }
  }
};

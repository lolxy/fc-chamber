import Vue from 'vue';
import fetchFollowingTypes from '@/services/my/following/fetchFollowingTypes';
import fetchFollowingList from '@/services/my/following/fetchFollowingList';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      filters: {
        currentTypesId: []
      },
      followingStream: [],
      currentStreamPage: 0,
    }
  },
  components: {
    InfiniteLoading,
    vLayout: require('@/layouts/default/default.vue'),
    streamMarketItem: require('@/components/stream/streamItem/item.vue'),
    streamItem: require('@/components/following/streamItem/item.vue'),
    listItem: require('@/components/following/listItem/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    followingList() {
      return this.$store.state.myFollowing.list;
    },
    latestFollowingList() {
      return this.$store.state.myFollowing.list.filter((item, index) => index < 6);
    },
    followingTypes() {
      return this.$store.state.myFollowing.types;
    },
    followingTypesIds() {
      let itemsIds = [];
      const items = this.$store.state.myFollowing.types.Company.ItemTypes;
      if (items.length) {
        items.forEach((item) => {
          itemsIds.push(item.Code);
        })
      }
      return itemsIds;
    }
  },
  mounted() {
    if (!Object.keys(this.followingTypes).length) {
      fetchFollowingTypes();
    }
    if (!this.followingList.length) {
      fetchFollowingList();
    }
  },
  methods: {
    handleCheckAllChange(event) {
      this.filters.currentTypesId = event.target.checked ? this.followingTypesIds : [];
      this.isIndeterminate = false;
    },
    handleCheckedTypesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.filters.currentTypesId.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.followingTypesIds.length;
    },
    fetchMarketStream() {
      const myUserId = localStorage.getItem('userId');

      const itemTypeIds = this.filters.currentTypesId.join(',');

      Vue.$http.get('/MemberSubscriptionNotifications', {
        params: {
          userId: myUserId,
          hasRelObj: true,
          fields: 'RelObj,RelObj.Images,RelObj.Type,RelObj.Company,RelObj.Company.Categories,Subscription',
          itemType: itemTypeIds,
          take: 12,
          skip: this.currentStreamPage * 12,
        },
      }).then((response) => {
        let streams = response.data;
        streams = streams.filter(item => item.RelObj);

        if (streams.length) {
          this.followingStream = this.followingStream.concat(streams);
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (streams.length < 12) {
            this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentStreamPage = this.currentStreamPage + 1;
        } else {
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    onStreamInfinite() {
      this.fetchMarketStream();
    },
    reloadStream() {
      this.followingStream = [];
      this.currentStreamPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    formatStreamGallery(item) {
      let images = _.map(item.Images, function(image, index) {
        let imgSrc = image.OriginalPath;

        if (imgSrc.startsWith('http:')) {
          imgSrc = imgSrc.substring(5);
        }

        delete image['Remark'];

        _.set(image, 'src', `${imgSrc}?imageView2/2/w/1200`);

        return Object.assign({}, image, { w: 0, h: 0 });
      });

      Vue.set(item, 'gallery', images);
    },
  },
  watch: {
    filters: {
      handler(val, oldVal) {
        this.reloadStream();
      },
      deep: true
    }
  }
};

import Vue from 'vue';
import fetchFollowingTypes from '@/services/my/following/fetchFollowingTypes';
import fetchFollowingList from '@/services/my/following/fetchFollowingList';
import InfiniteLoading from 'vue-infinite-loading';

import formatMyFriendGroups from '@/services/my/friends/formatMyFriendGroups';

export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      currentGroupId: [],
      friendGroup: [],
      friendStream: [],
      currentStreamPage: 0,
      galleries: {}
    }
  },
  components: {
    InfiniteLoading,
    vLayout: require('@/layouts/default/default.vue'),
    streamItem: require('@/components/stream/streamItem/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    friendGroupIds() {
      const ids = [];
      this.friendGroup.forEach((item) => {
        ids.push(item.Id);
      });
      return ids;
    }
  },
  mounted() {
    const groups = formatMyFriendGroups();
    this.friendGroup = groups.filter(item => item.Id !== 'all');
  },
  methods: {
    handleCheckAllChange(event) {
      this.currentGroupId = event.target.checked ? this.friendGroupIds : [];
      this.isIndeterminate = false;
    },
    handleCheckedTypesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.currentGroupId.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.friendGroupIds.length;
    },
    fetchMarketStream() {
      const meid = localStorage.getItem('meId');
      const groupIds = this.currentGroupId.join(',');

      Vue.$http.get('/EmployeeTalks', {
        params: {
          fields: 'Sender.User,Sender.Company,Sender.Company.Categories,Images,Comments,Comments.Sender,Comments.Sender.User,Rels',
          meId: meid,
          friendGroupId: groupIds,
          take: 12,
          skip: this.currentStreamPage * 12,
        },
      }).then((response) => {
        let streams = response.data;

        if (streams.length) {
          this.friendStream = this.friendStream.concat(streams);
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
      this.friendStream = [];
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
    onImageLoaded(image, itemId) {
      if (!this.galleries[`gallery${itemId}`]) {
        Vue.set(this.galleries, `gallery${itemId}`, [image]);
      } else {
        this.galleries[`gallery${itemId}`].push(image);
      }
    },
    deleteThisStream(itemId) {
      this.list = this.list.filter(item => item.Id !== itemId);
    }
  },
  watch: {
    currentGroupId() {
      this.reloadStream();
    }
  }
};

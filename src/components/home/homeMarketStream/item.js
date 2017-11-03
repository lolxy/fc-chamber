/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      activePanel: 'all',
      streamCats: [{
        Title: '全部',
        Id: 'all'
      },{
        Title: '面料',
        Id: 'd2a41247-5a35-e711-80e4-da42ba972ebd'
      },{
        Title: '辅料',
        Id: 'bd5c1250-5a35-e711-80e4-da42ba972ebd'
      }],
      streamList: [],
      currentCategory: null,
      isFeatured: true
    }
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  mounted() {
    this.fetchStreamList();
  },
  methods: {
    getCategory(item) {
      return _.filter(item.Sender.Company.Categories, category => category.TypeId == '07154e16-de57-e611-b281-a00b61b73b60');
    },
    getIndustry(item) {
      return _.filter(item.Sender.Company.Categories, industry => industry.TypeId == '4d2d281e-de57-e611-b281-a00b61b73b60');
    },
    fetchStreamList() {
      const listParams = {
        fields: 'Sender,Sender.Company,Sender.Company.Categories,Category,Type,Tags',
        take: 16
      };

      if (this.currentCategory !== 'all') {
        listParams['categoryId'] = this.currentCategory;
      }

      Vue.$http.get('/MarketTalks', {
        params: listParams,
      }).then((response) => {
        let streamList = response.data;
        streamList = streamList.filter(item => item.SenderId);
        streamList = streamList.filter(item => item.Sender.CompanyId);
        this.streamList = streamList;
      });
    },
    handleClick(tab) {
      this.currentCategory = tab.name;
      this.reloadStreamList();
    },
    reloadStreamList() {
      this.fetchStreamList();
    },
    getStreamCover(gallery) {
      return gallery[0];
    }
  }
};

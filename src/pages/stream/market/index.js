/* ============
 * Market Timeline Page
 * ============
 *
 */

import Vue from 'vue';
import store from '@/store';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'market-stream',
  data() {
    return {
      checkAll: true,
      isIndeterminate: true,
      list: [],
      tags: [],
      types: [
        {
          Id: null,
          Name: '全部'
        }
      ],
      roles: [
        {
          Id: null,
          Name: '全部'
        }
      ],
      categories: [
        {
          Id: null,
          Name: '全部'
        }
      ],
      showAllCategory: false,
      filters: {
        currentTagId: [],
        currentTypeId: null,
        currentRoleId: null,
        currentCategoryId: null,
      },
      currentStreamPage: 0,
      galleries: {},
      checkFavoriteJson:{},
      allEmployeeRoles:[],
      allRoleList:{}
    };
  },
  components: {
    InfiniteLoading,
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
    streamForm: require('@/components/stream/streamMarketForm/item.vue'),
    fakeStreamForm: require('@/components/stream/fakeStreamForm/item.vue'),
    streamItem: require('@/components/stream/streamItem/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId(){
      return localStorage.getItem('userId');
    },
    companyId() {
      return localStorage.getItem('companyId');
    },
    hasCompany() {
      const myUserId = localStorage.getItem('userId');
      const companyId = localStorage.getItem('companyId');
      const myCompany = this.$store.state.myIdentities.list.filter(item => item.CompanyId === companyId);
      if (myCompany.length) {
        if (myCompany[0].Company.OwnerId === myUserId) {
          return true;
        }
        return false;
      }
      return false;
    },
    marketStream() {
      return this.list;
    },
    streamCatByIndustry() {
      const cats = this.streamCats[`cat-${this.categoryId}`].Categories.filter(item => item.ParentId === this.stream.catTypeId);
      if (this.stream.catTypeId) {
        return cats;
      }
      return [];
    },
    formatedCategories() {
      return this.categories.filter((item, index) => {
        if (this.showAllCategory) {
          return item;
        }
        return index < 27;
      });
    },
    formatAllEmployeeRoles(){
      if(this.allEmployeeRoles.length){
        this.allEmployeeRoles.forEach((item)=>{
          Vue.set(this.allRoleList,`${item.Code}`,_.map(item.Employees,(item)=>{
            return {
              'UserId':item.UserId
            }
          }));
        });
      }
      return this.allRoleList;
    },
    isRoles() {
      if(this.formatAllEmployeeRoles && this.formatAllEmployeeRoles['MarketTalkAdmin']){
        return this.getRoles('MarketTalkAdmin');
      }
    },
    currentCategory() {
      const catId = this.filters.currentCategoryId;
      const currCat = this.categories.filter(item => item.Id === catId);
      if (currCat.length) {
        return currCat[0];
      }
      return null;
    }
  },
  mounted() {
    this.fetchTags();
    this.fetchTypes();
    this.fetchRoles();
    this.fetchMyRoles();
    this.fetchCategories();

    if (this.$store.state.route.query.category) {
      this.filters.currentCategoryId = this.$store.state.route.query.category;
    }

    if (this.$store.state.route.query.type) {
      this.filters.currentTypeId = this.$store.state.route.query.type;
    }

    if (this.$store.state.route.query.tag) {
      this.filters.currentTagId.push(this.$store.state.route.query.tag);
    }
  },
  watch: {
    auth(authed) {
      if (authed) {
        this.list.forEach((item)=>{
          this.checkFavorite(item.Id);
        });
      }
    },
    formatAllEmployeeRoles() {
      this.fetchMyRoles();
    },
    currentCategoryId(val, oldVal) {
      let newHref = `${window.location.origin}${window.location.pathname}`;

      if (val) {
        newHref = `${window.location.origin}${window.location.pathname}?category=${val}`;
      }
      window.history.pushState({page: 'Market Stream'}, `Page Market Stream`, newHref);

      this.reloadStream();
    },
    filters: {
      handler(val, oldVal) {
        this.reloadStream();
      },
      deep: true
    }
  },
  methods: {
    fetchMyRoles() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/My/EmployeeRoles',{
        params: {
          meId:meId,
          fields: 'Employees.Roles'
        },
      }).then((response) => {
        this.allEmployeeRoles = response.data;
      });
    },
    getRoles(roles){
      if(this.formatAllEmployeeRoles && this.formatAllEmployeeRoles[roles]){
        const myRoles = this.formatAllEmployeeRoles[roles].filter((item) => {
          return item.UserId === this.userId;
        });
        if (myRoles.length) {
          return true;
        }
      }
      return false;
    },
    handleCheckAllChange(event) {
      this.filters.currentTagId = event.target.checked ? this.filters.currentTagId : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.filters.currentTagId.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tags.length;
    },
    getCurrentCategory(id) {
      this.filters.currentCategoryId = id;
    },
    removeCurrentCategory() {
      this.filters.currentCategoryId = null;
    },
    showMoreCategory() {
      this.showAllCategory = true;
    },
    showLessCategory() {
      this.showAllCategory = false;
    },
    checkFavorite(marketId){
      Vue.$http.get(`/MemberFavorites`,{
        params: {
          UserId:this.userId,
          RelType:'CompanyTalk',
          RelId:marketId
        }
      }).then((response) => {
        if (!this.checkFavoriteJson[marketId]) {
          Vue.set(this.checkFavoriteJson,marketId,{});
        }
        Vue.set(this.checkFavoriteJson[marketId],'isFavorite',response.data.length?true:false);
        if(response.data.length){
          Vue.set(this.checkFavoriteJson[marketId],'favoriteId',response.data[0].Id);
        }
      })
    },
    fetchMarketStream() {
      let tagIds;

      if (this.filters.currentTagId.length === 1) {
        tagIds = this.filters.currentTagId[0];
      }

      if (this.filters.currentTagId.length > 1) {
        tagIds = this.filters.currentTagId.join(',');
      }

      Vue.$http.get('/MarketTalks', {
        params: {
          fields: 'Sender.Company,Sender.Company.Categories,Sender.User,Images,Categories,Type,Tags',
          take: 6,
          skip: this.currentStreamPage * 6,
          role: this.filters.currentRoleId,
          categoryId: this.filters.currentCategoryId,
          typeId: this.filters.currentTypeId,
          tagIds: tagIds,
        },
      }).then((response) => {
        const streams = response.data;
        if (streams.length) {
          this.list = this.list.concat(streams);
          if (this.auth) {
            response.data.forEach((item)=>{
              this.checkFavorite(item.Id);
            });
          }
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          if (streams.length < 6) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentStreamPage = this.currentStreamPage + 1;
        } else {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    fetchTags() {
      Vue.$http.get('/MarketTalks/Tags')
        .then((response) => {
          this.tags = this.tags.concat(response.data);
        });
    },
    fetchTypes() {
      Vue.$http.get('/MarketTalks/Types')
        .then((response) => {
          this.types = this.types.concat(response.data);
        });
    },
    fetchRoles() {
      Vue.$http.get('/MarketTalks/Roles')
        .then((response) => {
          this.roles = this.roles.concat(response.data);
        });
    },
    fetchCategories() {
      Vue.$http.get('/MarketTalks/Categories')
        .then((response) => {
          this.categories = this.categories.concat(response.data);
        });
    },
    reloadStream() {
      this.toTime = null;
      this.list = [];
      this.checkFavoriteJson = {};
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    onInfinite() {
      this.fetchMarketStream();
    },
    onImageLoaded(data, itemId) {
      if (!this.galleries[`gallery${itemId}`]) {
        const cItem = _.find(this.list, item => item.Id === itemId);
        const cGallery = [];
        cItem.Images.forEach(item => {
          cGallery.push({})
        })
        cGallery[data.index] = data.image;
        Vue.set(this.galleries, `gallery${itemId}`, cGallery);
      } else {
        this.galleries[`gallery${itemId}`][data.index] = data.image
      }
    },
    prePendStream(stream) {
      const newArr = [stream];
      this.list = newArr.concat(this.list);
      if (this.auth) {
        newArr.forEach((item)=>{
          this.checkFavorite(item.Id);
        });
      }
    },
    deleteThisStream(itemId) {
      this.list = this.list.filter(item => item.Id !== itemId);
    }
  },
};

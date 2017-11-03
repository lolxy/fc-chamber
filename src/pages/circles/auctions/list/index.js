import Vue from 'vue';
import store from '@/store';
import VueCountdown2 from 'vue-countdown-2';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      list: [],
      types: [],
      filters: {},
      currentPage: 0,
      currentTime: new Date().getTime(),
      currentMenu: 'all',
      menu: [
        {
          name: '所有供应',
          handle: 'all',
          icon: 'fa-bars'
        },
        {
          name: '我的供应',
          handle: 'mine',
          icon: 'fa-user'
        },
        {
          name: '发布供应',
          handle: 'create',
          icon: 'fa-edit'
        }
      ],
      currentItem: {},
      detailDialogVisble: false,
      auctionManagerVisible: false,
      auctionCommentVisible: false,
      loginDialogVisible: false,
      allEmployeeRoles:[],
      allRoleList:{}
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId(){
      return localStorage.getItem('userId');
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
    meId() {
      return localStorage.getItem('meId');
    },
    slug() {
      if (this.$store.state.route.params.slug) {
        return this.$store.state.route.params.slug;
      }
      return 'all';
    },
    isCompanyOwner() {
      const companyId = localStorage.getItem('companyId');
      const userId = localStorage.getItem('userId');
      const myCompany = this.$store.state.myCompanies.list.filter(item => item.Id === companyId);
      if (myCompany.length) {
        if (myCompany[0].OwnerId === userId) {
          return true;
        }
        return false;
      }
      return false;
    }
  },
  components: {
    VueCountdown2,
    InfiniteLoading,
    vLayout: require('@/layouts/default/default.vue'),
    streamItem: require('@/components/stream/streamItem/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
    auctionManager: require('@/components/circles/auctionManager/item.vue'),
    auctionComment: require('@/components/circles/auctionComment/item.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
  },
  mounted() {
    this.fetchTypes();
    this.fetchRoles();
    if (this.$store.state.route.params.slug) {
      this.currentMenu = this.slug;
    }
  },
  methods: {
    fetchRoles() {
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
    fetchTypes() {
      Vue.$http.get('../v1/AuctionCategoryTypes?fields=Categories').then((response) => {
        this.types = _.sortBy(response.data, item => item.Ordering).reverse();
        this.types.forEach((item) => {
          Vue.set(this.filters, `cat-${item.Id}`, null);
        })
      });
    },
    fetchList() {
      let meId = null;
      if (this.currentMenu === 'mine') {
        meId = localStorage.getItem('meId');
      } else {
        meId = null;
      }
      const catIds = Object.values(this.filters).filter(value => value !== null).join(',');

      Vue.$http.get('../v1/Auctions', {
        params: {
          fields: 'CurrPrice,Publisher,Images,Company',
          take: 12,
          categoryId: catIds,
          publisherId: meId,
          skip: this.currentPage * 12,
        },
      }).then((response) => {
        let list = response.data;
        this.currentPage = this.currentPage + 1;

        if (list.length) {
          this.list = this.list.concat(list);
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (list.length < 12) {
            this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
        } else {
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    onStreamInfinite() {
      if (this.currentMenu) {
        this.fetchList();
      }
    },
    reloadList() {
      this.currentPage = 0;
      this.list = [];
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    isEnded(time) {
      const endTime = new Date(time).getTime();
      if (this.currentTime > endTime) {
        return true;
      }
      return false;
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
    openDetailDialog(item) {
      this.currentItem = {};
      this.currentItem = item;
      this.detailDialogVisble = true;
    },
    openAuctionManager() {
      if (this.auth) {
        if (this.isCompanyOwner || this.getRoles('AuctionAdmin')) {
          this.auctionManagerVisible = true;
        } else {
          this.$alert('只有管理员或有相应权限的成员才能发布供应', {
            confirmButtonText: '知道了'
          });
        }
      } else {
        this.loginDialogVisible = true;
      }
    },
    openAuctionComment() {
      if (this.auth) {
        if (this.isCompanyOwner || this.getRoles('AuctionAdmin')) {
          this.auctionCommentVisible = true;
        } else {
          this.$alert('只有管理员或有相应权限的成员才能参与报价', {
            confirmButtonText: '知道了'
          });
        }
      } else {
        this.loginDialogVisible = true;
      }
    },
    askForThis(currentItem) {
      if (this.auth) {
        this.insertSession(currentItem);
        store.dispatch('contact/toggleContactPanel', true);
        store.dispatch('contact/switchContactPanel', 'contact.sessions');
        this.detailDialogVisble = false;
      } else {
        this.loginDialogVisible = true;
      }
    },
    insertSession(currentItem) {
      const self = this;
      window.nim.insertLocalSession({
        scene: 'p2p',
        to: currentItem.Publisher.AccId,
        done(error, session) {
          store.dispatch('nim/switchNimCurrentSession', `p2p-${currentItem.Publisher.AccId}`);
          store.dispatch('contact/switchContactPanel', 'contact.sessions');
          store.dispatch('contact/toggleContactPanel', true);
          self.sendCustomMsg(currentItem, currentItem.Publisher.AccId);
        }
      });
    },
    sendCustomMsg(currentItem, sessionTo) {
      const self = this;
      const content = {
        type: "5",
        data: {
          tag: "auction",
          content: {
            Images: currentItem.Images,
            Id: currentItem.Id,
            Qty: currentItem.Qty,
            CurrPrice: self.formatPrice(currentItem.CurrPrice),
            Title: currentItem.Title,
            EndTime: currentItem.EndTime,
            Company: {
              BrandName: currentItem.Company.BrandName,
              Id: currentItem.CompanyId,
              ResidentProvince: currentItem.Company.ResidentProvince,
              NotAllPass: currentItem.Company.NotAllPass,
              ResidentCity: currentItem.Company.ResidentCity,
              ResidentArea: currentItem.Company.ResidentArea,
              VerifyStatus: currentItem.Company.VerifyStatus
            }
          }
        }
      };

      window.nim.sendCustomMsg({
        scene: 'p2p',
        to: sessionTo,
        content: JSON.stringify(content),
        pushContent: "[供应]"
      });
    },
    onAuctionManagerUpdate(item) {
      this.list = [item].concat(this.list);
      this.auctionManagerVisible = false;
    },
    closeAuction(item) {
      this.$prompt('请输入关闭原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        Vue.$http.post(`../v1/Auctions/MakeClose/?id=${item.Id}&isClose=true&CloseReason=${value}`).then((response) => {
          window.location.reload(true);
        })
      })
    },
    openAuction(item) {
      Vue.$http.post(`../v1/Auctions/MakeClose/?id=${item.Id}&isClose=false&CloseReason=null`).then((response) => {
        window.location.reload(true);
      })
    },
    deleteAuction(item) {
      this.$confirm('此操作将永久删除该供应, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'btn-danger',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`../v1/Auctions/${item.Id}`).then((response) => {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: `成功删除了供应：${item.Title}`,
            offset: 50,
          });
          this.detailDialogVisble = false;
          this.list = this.list.filter(listItem => listItem.Id !== item.Id);
        }).catch((error) => {
          this.$notify({
            type: 'error',
            title: '操作失败',
            message: `${error.response.data.Message}`,
            offset: 50,
          });
        })
      })
    },
    switchMenu(handle) {
      this.$router.push({ name: 'circles.auctions.list', params: { slug: handle }});
    },
    onAuctionCommentClose() {
      this.auctionCommentVisible = false;
    }
  },
  watch: {
    slug(nVal, oVal) {
      this.currentMenu = nVal;
      this.reloadList();
    },
    formatAllEmployeeRoles(){
      this.fetchRoles();
    },
    filters: {
      handler(val, oldVal) {
        this.reloadList();
      },
      deep: true
    }
  }
};

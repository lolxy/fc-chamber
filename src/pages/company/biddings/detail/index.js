import Vue from 'vue';
import store from '@/store';
import VueCountdown2 from 'vue-countdown-2';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      types: [],
      filters: {},
      currentPage: 0,
      currentTime: new Date().getTime(),
      currentMenu: 'all',
      menu: [
        {
          name: '所有求购',
          handle: 'all',
          icon: 'fa-bars'
        },
        {
          name: '我的求购',
          handle: 'mine',
          icon: 'fa-user'
        },
        {
          name: '发布求购',
          handle: 'create',
          icon: 'fa-edit'
        }
      ],
      detail: {},
      detailLoaded: false,
      offers: [],
      detailDialogVisble: false,
      biddingManagerVisible: false,
      biddingCommentVisible: false,
      loginDialogVisible: false,
      allEmployeeRoles:[],
      allRoleList:{}
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    companyId() {
      return this.$store.state.route.params.id;
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
    entryId() {
      return this.$store.state.route.params.id;
    },
    isCompanyOwner() {
      const companyId = this.companyId;
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
    avatar: require('@/components/avatar/avatar.vue'),
    vLayout: require('@/layouts/default/default.vue'),
    streamItem: require('@/components/stream/streamItem/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
    biddingManager: require('@/components/circles/biddingManager/item.vue'),
    biddingComment: require('@/components/circles/biddingComment/item.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
  },
  mounted() {
    this.fetchTypes();
    this.fetchDetail();
    this.fetchOffers();
    if (this.$store.state.route.params.id) {
      this.fetchRoles();
    }
  },
  watch:{
    companyId() {
      if (this.$store.state.route.params.id) {
        this.fetchRoles();
      }
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
      Vue.$http.get('../v1/BiddingCategoryTypes?fields=Categories').then((response) => {
        this.types = _.sortBy(response.data, item => item.Ordering).reverse();
        this.types.forEach((item) => {
          Vue.set(this.filters, `cat-${item.Id}`, null);
        })
      });
    },
    fetchDetail() {
      Vue.$http.get(`../v1/Biddings/${this.entryId}?fields=CurrPrice,Publisher,Images,Company`).then((response) => {
        this.detail = response.data;
        this.detailLoaded = true;
      });
    },
    fetchOffers() {
      Vue.$http.get('../v1/BiddingOffers/', {
        params: {
          BiddingId: this.entryId,
          fields: 'Sender,Company'
        }
      }).then((response) => {
        this.offers = response.data;
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
      if (price) {
        let priceValue = price.toString();
        const hasDecimal = priceValue.indexOf('.');
        const ifInfinite = priceValue.indexOf('e');
        if (hasDecimal && ifInfinite !== -1) {
          priceValue = priceValue.slice(0, ifInfinite);
          priceValue = Math.round(priceValue * 100) / 100;
        }
        if (hasDecimal) {
          priceValue = Math.round(priceValue * 100) / 100;
        }
        return priceValue;
      }
      return price;
    },
    openDetailDialog(item) {
      this.currentItem = item;
      this.detailDialogVisble = true;
    },
    onBiddingsManagerUpdate(item) {
      this.list = [item].concat(this.list);
      this.auctionManagerVisible = false;
    },
    closeBiddings(item) {
      this.$prompt('请输入关闭原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        Vue.$http.post(`../v1/Biddings/MakeClose/?id=${item.Id}&isClose=true&CloseReason=${value}`).then((response) => {
          window.location.reload(true);
        })
      })
    },
    openBiddings(item) {
      Vue.$http.post(`../v1/Biddings/MakeClose/?id=${item.Id}&isClose=false&CloseReason=null`).then((response) => {
        // window.location.reload(true);
        console.log(response.data);
      })
    },
    deleteBiddings(item) {
      this.$confirm('此操作将永久删除该供应, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'btn-danger',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`../v1/Biddings/${item.Id}`).then((response) => {
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
      this.$router.push({ name: 'circles.biddings.list', params: { slug: handle }});
    },
    openBiddingManager() {
      if (this.auth) {
        if (this.isCompanyOwner || this.getRoles('BiddingAdmin')) {
          this.biddingManagerVisible = true;
        } else {
          this.$alert('只有管理员或有相应权限的成员才能发布求购', {
            confirmButtonText: '知道了'
          });
        }
      } else {
        this.loginDialogVisible = true;
      }
    },
    openBiddingComment() {
      if (this.auth) {
        if (this.isCompanyOwner || this.getRoles('BiddingAdmin')) {
          this.biddingCommentVisible = true;
        } else {
          this.$alert('只有管理员或有相应权限的成员才能参与投标', {
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
        type: "6",
        data: {
          tag: "bidding",
          content: {
            Images: currentItem.Images,
            ProductionType: currentItem.ProductionType,
            Id: currentItem.Id,
            Qty: currentItem.Qty,
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
      this.biddingManagerVisible = false;
    },
    onBiddingCommentClose() {
      this.biddingCommentVisible = false;
    },
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    },
  },
};

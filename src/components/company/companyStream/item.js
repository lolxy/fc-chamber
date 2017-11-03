/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';

import infiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      streams: [],
      toTime: null,
      employees: [],
      galleries: {},
      allEmployeeRoles:[],
      allRoleList:{},
      checkFavoriteJson:{}
    }
  },
  components: {
    infiniteLoading,
    avatar: require('@/components/avatar/avatar.vue'),
    streamForm: require('@/components/stream/streamMarketForm/item.vue'),
    streamItem: require('@/components/stream/streamItem/item.vue'),
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    isMyCompany() {
      const myUserId = localStorage.getItem('userId');
      const companyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myIdentities.list.filter(item => item.CompanyId === companyId);
      if (myCompany.length) {
        if (myCompany[0].Company.OwnerId === myUserId) {
          return true;
        }
        return false;
      }
      return false;
    },
    userId() {
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
    }
  },
  mounted() {
    if (this.$store.state.route.params.id) {
      const companyId = this.$store.state.route.params.id;
      this.fetchEmployeesByCompany(companyId);
      this.fetchRoles();
    }
  },
  watch:{
    companyId() {
      this.fetchRoles();
    },
    auth(authed) {
      if (authed) {
        this.streams.forEach((item)=>{
          this.checkFavorite(item.Id);
        });
      }
    },
  },
  methods: {
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
    onImageLoaded(image, itemId) {
      if (!this.galleries[`gallery${itemId}`]) {
        Vue.set(this.galleries, `gallery${itemId}`, [image]);
      } else {
        this.galleries[`gallery${itemId}`].push(image);
      }
    },
    reloadStream() {
      this.toTime = null;
      this.streams = [];
      this.checkFavoriteJson = {};
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    onInfinite() {
      let companyId = this.$store.state.route.params.id;
      if (this.$store.state.route.name == 'my.company') {
        companyId = localStorage.getItem('companyId');
      }
      this.fetchCompanyStreamById(companyId);
    },
    fetchCompanyStreamById(id) {
      Vue.$http.get(`/MarketTalks`, {
        params: {
          fields: 'Sender.Company,Sender.Company.Categories,Sender.User,Images,Category,Type,Tags',
          companyId: id,
          hasAcl: false,
          take: 12,
          toTime: this.toTime
        },
      }).then((response) => {
        const streams = response.data;

        if (streams.length) {
          this.streams = this.streams.concat(streams);
          if (this.auth) {
            response.data.forEach((item)=>{
              this.checkFavorite(item.Id);
            });
          }
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          if (streams.length < 12) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }

          let toTime = streams[streams.length - 1].CreatedTime;
          toTime = new Date(toTime);

          const milliseconds = toTime.getMilliseconds();

          toTime.setMilliseconds(milliseconds - 1);
          toTime = toTime.toISOString();

          this.toTime = toTime;
        } else {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    fetchEmployeesByCompany(id) {
      let meId = null;
      const companyId = localStorage.getItem('companyId');
      if (this.auth) {
        meId = localStorage.getItem('meId');

        if (this.$store.state.route.params.id === companyId) {
          meId = null;
        }
      }

      Vue.$http.get('/Employees', {
        params: {
          meId: meId,
          CompanyId: id,
          IsShowInCompanySite: true,
          fields: 'User,Company,RelationshipOfUs',
        },
      }).then((response) => {
        this.employees = this.employees.concat(response.data);
      });
    },
    prePendStream(stream) {
      this.streams = [stream].concat(this.streams);
    },
    goTop() {
      window.scrollTo(0,0);
    },
  }
};

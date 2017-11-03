import Vue from 'vue';
import _ from 'lodash'

export default {
  name: 'cham-company-list',
  components: {
    memberSearchList: require('@/components/cham/memberSearchList/item.vue')
  },
  data() {
    return {
      memberList: [],
      keyword: '',
    }
  },
  props: ['currentCompanyId'],
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  methods: {
    searchMember() {
      const self = this;
      if (self.keyword.length) {
        self.fetchMemberBykeyword();
      }
    },
    fetchMemberBykeyword() {
      const self = this;
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/Employees', {
        params: {
          meId: meId,
          fields: 'Company,User,RelationshipOfUs',
          'args.keyword': self.keyword
        },
      }).then((response) => {
        self.memberList = response.data;
      }).catch((error) => {
        this.$message({
          message: error.response.data.Message,
          type: 'error'
        });
      });
    },

    onReloadList() {
      this.memberList = [];
      this.$emit('managerUpdate');
    }
  }
};

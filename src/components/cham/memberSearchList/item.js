/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {

    }
  },
  props: [
    'items',
    'currentCompanyId'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {

  },
  methods: {
    pointerThisMember(item) {
      Vue.$http.post(`${process.env.apiCham}/commerceChamber/deliverMember`, {
        commerceChamberId:this.chamId,
        companyId:this.currentCompanyId,
        memberIdentity:item.Id,
        memberCompanyId:item.CompanyId,
        identity:this.meId
      }).then((response)=>{
        this.$notify({
          title: '操作成功',
          message: `您已指派该公司给${item.Name}`,
          type: 'success',
          offset: 50
        });
        this.$emit('reloadList');
      }).catch((error)=>{
        this.$message({
          message: error.response.data.Message,
          type: 'error'
        });
      });
    }
  }
};

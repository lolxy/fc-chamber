import Vue from 'vue';
import VueDND from 'awe-dnd';
Vue.use(VueDND);

export default {
  props: [
    'items'
  ],
  mounted() {
    this.$dragging.$on('dragged', ({ value }) => {
      value.list.forEach((item, index) => {
        this.updateAdOrder(item, index)
      })
    })
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  methods: {
    updateAdOrder(item, index) {
      Vue.$http.post(`${process.env.apiCham}/banner/update`, {
        bannerId: item.id,
        commerceChamberId: item.commerceChamberId,
        imageId: item.imageId,
        identity: item.createIdentity,
        contentUrl: item.contentUrl,
        orange: index,
      });
    },
    deleteItem(item) {
      this.$confirm('您确认删除此广告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`${process.env.apiCham}/banner/delete`, {
          params: {
            bannerId: item.id,
            commerceChamberId: this.chamId,
            identity: this.meId
          }
        }).then(() => {
          this.$notify({
            title: '操作成功',
            message: '您已成功删除该广告！',
            type: 'success'
          })
          this.$emit('adListDeleted', item.id);
        }).catch((error)=>{
          this.$notify({
            title: '操作失败',
            message: error.response.data.Message,
            type: 'error'
          })
        });
      }).catch(()=>{
        this.$message({
          message: '您已取消删除操作',
          type: 'warning'
        })
      });
    }
  }
};

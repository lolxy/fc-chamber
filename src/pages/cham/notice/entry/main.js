import Vue from 'vue';

export default {
  name: 'cham-notice-entry',
  data() {
    return {
      entry: {}
    }
  },
  computed: {
    entryId() {
      return this.$store.state.route.params.entryId;
    },
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
  mounted() {
    this.fetchNotice();
  },
  methods: {
    fetchNotice() {
      Vue.$http.get(`${process.env.apiCham}/notice/info`, {
        params: {
          noticeId: this.entryId,
          commerceChamberId:this.chamId,
          identity:this.meId
        }
      }).then((response) => {
        this.entry = response.data;
      })
    },
    dellNotice() {
      this.$confirm('您是否确认删除该公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            Vue.$http.delete(`${process.env.apiCham}/notice/delete`, {
              params: {
                noticeId: this.entryId,
                commerceChamberId: this.chamId,
                identity:this.meId
              }
            }).then((response) => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.$router.push({name: 'cham.notice.list'});
            }).catch((error)=>{
            this.$message({
              type: 'error',
              message: error.response.data.Message
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};

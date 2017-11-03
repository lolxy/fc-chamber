/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      checkedTypes: []
    }
  },
  props: [
    'item',
    'types',
  ],
  mounted() {
    this.checkedTypes = this.item.ItemTypesStr.split(',');
    this.checkAll = ( this.checkedTypes.length === this.typesOptions.length);
  },
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    },
    typesOptions() {
      const options = [];
      this.types.Company.ItemTypes.forEach((typeItem) => {
        options.push(typeItem.Code);
      })
      return options;
    }
  },
  methods: {
    handleCheckAllChange(event) {
      this.checkedTypes = event.target.checked ? this.typesOptions : [];
      this.isIndeterminate = false;
      this.updateSettings();
    },
    handleCheckedTypesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.typesOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.typesOptions.length;
      this.updateSettings();
    },
    updateSettings() {
      Vue.$http.post('/MemberSubscriptions/Update', {
        Id: this.item.Id,
        ItemTypesStr: this.checkedTypes.join(',')
      }).then((res) => {
        if (!res.data.ItemTypesStr.length) {
          this.deleteSubscription();
        }
      });
    },
    deleteSubscription() {
      this.$confirm(`取消关注：${this.item.RelObj.BrandName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`/MemberSubscriptions/${this.item.Id}`).then((res) => {
          store.dispatch('myFollowing/deleteFollowingList', this.item.Id);
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: `成功取消关注了：${this.item.RelObj.BrandName}`,
            offset: 50
          });
        });
      })
    },
    formatCardBg(item) {
      if (item.VisualizationImgUrl) {
        let visualImgUrl = item.VisualizationImgUrl;
        if (visualImgUrl.startsWith('http:')) { visualImgUrl = visualImgUrl.substring(5); }
        return `${visualImgUrl}?imageView2/1/w/600/h/200`;
      } else {
        if (item.LogoUrl) {
          let logoSrc = item.LogoUrl;
          if (logoSrc.startsWith('http:')) { logoSrc = logoSrc.substring(5); }
          return `${logoSrc}?imageView2/1/w/600/h/200`;
        }
        return null;
      }
    }
  },
};

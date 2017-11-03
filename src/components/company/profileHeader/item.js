/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import fetchFollowingTypes from '@/services/my/following/fetchFollowingTypes';

export default {
  data() {
    return {
      uploadLogoImageData: {},
      uploadVisualizationImageData: {},
      bucketHost: `${process.env.qiniuBucketHost}`,
      modifiedLogoUrl: null,
      modifiedVisualizationImgUrl: null,
      isFollowing: false,
      verifyDialogVisible: false,
      following: {
        checkAll: false,
        isIndeterminate: false,
        checkedTypes: [],
        count: null,
        info: {}
      }
    }
  },
  props: [
    'company',
    'companyId',
    'employees',
  ],
  components: {
    Avatar: require('@/components/avatar/avatar.vue'),
    profileCover: require('@/components/company/profileCover/item.vue'),
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
    verifyManager: require('@/components/company/verifyManager/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId() {
      return localStorage.getItem('userId');
    },
    logoUrl() {
      return this.modifiedLogoUrl || this.company.LogoUrl;
    },
    visualizationImgUrl() {
      return this.modifiedVisualizationImgUrl || this.company.VisualizationImgUrl;
    },
    followingTypes() {
      return this.$store.state.myFollowing.types;
    },
    typesOptions() {
      const options = [];
      this.followingTypes.Company.ItemTypes.forEach((typeItem) => {
        options.push(typeItem.Code);
      })
      return options;
    }
  },
  methods: {
    fetchIsFollowing(id) {
      Vue.$http.get(`/MemberSubscriptions/Exists/Company/${id}`)
      .then((response) => {
        this.isFollowing = response.data;
        this.fetchFollowingInfo();
      });
    },
    fetchFollowingCount() {
      Vue.$http.get('/MemberSubscriptions/Count', {
        params: {
          RelType: 'Company',
          RelId: this.companyId
        }
      })
      .then((response) => {
        this.following.count = response.data;
      });
    },
    fetchFollowingInfo() {
      Vue.$http.get(`/MemberSubscriptions/GetByRelType/Company/${this.companyId}?fields=RelObj`).then((response) => {
        this.following.info = response.data;
      })
    },
    handleCheckedTypesChange(value) {
      let checkedCount = value.length;
      this.following.checkAll = checkedCount === this.typesOptions.length;
      this.following.isIndeterminate = checkedCount > 0 && checkedCount < this.typesOptions.length;
      this.updateSettings();
    },
    handleCheckAllChange(event) {
      this.following.checkedTypes = event.target.checked ? this.typesOptions : [];
      this.following.isIndeterminate = false;
      this.updateSettings();
    },
    updateSettings() {
      Vue.$http.post('/MemberSubscriptions/Update', {
        Id: this.following.info.Id,
        ItemTypesStr: this.following.checkedTypes.join(',')
      }).then((res) => {
        if (res.data.ItemTypesStr.length !== this.following.checkedTypes.length) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: '关注设置更新成功',
            offset: 50
          });
        }
        if (!res.data.ItemTypesStr.length) {
          this.deleteSubscription();
        }
      });
    },
    deleteSubscription() {
      this.$confirm(`取消关注：${this.following.info.RelObj.BrandName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`/MemberSubscriptions/${this.following.info.Id}`).then((res) => {
          store.dispatch('myFollowing/deleteFollowingList', this.following.info.Id);
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: `成功取消关注了：${this.following.info.RelObj.BrandName}`,
            offset: 50
          });
          this.isFollowing = false;
          this.following = {
            checkAll: false,
            isIndeterminate: false,
            checkedTypes: [],
            count: null,
            info: {}
          }
        });
      })
    },
    followingThisCompany() {
      let types = [];
      this.followingTypes.Company.ItemTypes.forEach((item) => {
        types.push(item.Code);
      });
      types = types.join(',');
      Vue.$http.post('/MemberSubscriptions/Add', {
        RelType: 'Company',
        RelId: this.companyId,
        ItemTypesStr: types,
      }).then(() => {
        this.isFollowing = true;
        this.fetchFollowingInfo();
      });
    },
    beforeLogoUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        const upToken = response.data.Token;
        this.uploadLogoImageData = {
          key,
          token: upToken,
        };
      });
    },
    handleLogoUploadSuccess(response) {
      const key = response.key;
      const url = `${this.bucketHost}/${encodeURI(key)}`;
      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      this.modifiedLogoUrl = url;

      Vue.$http.post('Companies', {
        Id: companyId,
        LogoUrl: url
      });
    },
    beforeVisualizationUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        const upToken = response.data.Token;
        this.uploadVisualizationImageData = {
          key,
          token: upToken,
        };
      });
    },
    handleVisualizationUploadSuccess(response, file, _fileList) {
      const key = response.key;
      const url = `${this.bucketHost}/${encodeURI(key)}`;

      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      this.modifiedVisualizationImgUrl = url;

      Vue.$http.post('Companies', {
        Id: companyId,
        VisualizationImgUrl: url
      });
    },
    openVerifyDialog() {
      this.verifyDialogVisible = true;
    }
  },
  mounted() {
    if (this.$store.state.route.params.id) {
      if (this.auth) {
        this.fetchIsFollowing(this.companyId);
      }
    }
    if (!Object.keys(this.followingTypes).length) {
      fetchFollowingTypes();
    }
    this.fetchFollowingCount();
  },
  watch: {
    companyId() {
      if (this.auth) {
        this.fetchIsFollowing(this.companyId);
      }
    },
    'following.info'(nVal, oVal) {
      if (nVal) {
        this.following.checkedTypes = nVal.ItemTypesStr.split(',');
        this.following.checkAll = ( this.following.checkedTypes.length === this.typesOptions.length);
      }
    }
  }
};

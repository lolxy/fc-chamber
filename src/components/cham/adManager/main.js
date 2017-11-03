import Vue from 'vue';

export default {
  name: 'slide-manager',
  data() {
    return {
      adFrom: {
        imageId: null,
        contentUrl: null,
        identity: null,
        chamId: null,
        orange: 0
      },
      coverImage: {},
      imageData: {},
      uploadUrl: `${process.env.apiMall}/imgManager/adminUpLoadPic`,
    }
  },
  props: ['adId'],
  computed: {
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    cIdentity() {
      const meId = localStorage.getItem('meId');
      const cIdentity = _.find(store.state.myIdentities.list, item => item.Id === meId);
      if (cIdentity && cIdentity.Id) {
        return cIdentity;
      }
      return {};
    }
  },
  mounted() {
    if (this.adId) {
      this.fetchSlide();
    }
  },
  methods: {
    fetchSlide() {
      Vue.$http.get(`${process.env.apiCham}/banner/lists`, {
        params: {
          identity: this.cIdentity,
          commerceChamberId:this.chamId
        }
      }).then((response) => {
        const article = response.data;
        this.adFrom.advertisementId = article.id;
        this.adFrom.imageId = article.imageId;
        this.adFrom.contentUrl = article.contentUrl;
        this.adFrom.orange = article.orange;
      })
    },
    beforeUpload(file) {
      const meId = localStorage.getItem('meId');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        this.imageData['identity'] = meId
      } else {
        this.$refs.imageUploader.clearFiles();
        this.$message.error('上传图片大小不能超过 2MB!');
      }
    },
    handleSuccess(response) {
      const image = response;
      Vue.set(image, 'url', image.link);
      this.adFrom.imageId = response.id;
      this.coverImage = image;
    },
    createNew() {
      const meId = localStorage.getItem('meId');
      this.adFrom['identity'] = meId;
      this.adFrom['commerceChamberId'] = Number(localStorage.getItem('chamId'));

      Vue.$http.post(`${process.env.apiCham}/banner/create`, this.adFrom).then((response) => {
        this.$emit('adManagerUpdate');
        this.$notify({
          title: '操作成功',
          message: '广告图创建成功',
          type: 'success',
          offset: 30
        });
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: `${error.response.data.Message}`,
          type: 'error',
          offset: 30
        });
      })
    },
    saveChanges() {
      const meId = localStorage.getItem('meId');
      this.adFrom['identity'] = meId;
      this.adFrom['commerceChamberId'] = this.chamId;

      Vue.$http.post(`${process.env.apiCham}/banner/update`, this.adFrom).then((response) => {
        this.$emit('adManagerUpdate');
        this.$notify({
          title: '操作成功',
          message: '广告图更新成功',
          type: 'success',
          offset: 30
        });
      }).catch((error) => {
        this.$notify({
          title: '操作失败',
          message: `${error.response.data.message}`,
          type: 'error',
          offset: 30
        });
      })
    }
  }
};

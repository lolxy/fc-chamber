import Vue from 'vue';

export default {
  name: 'slide-manager',
  data() {
    return {
      adFrom: {
        imageId: null,
        contentUrl: null,
        identity: null,
        mallId: null,
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
    }
  },
  mounted() {
    if (this.adId) {
      this.fetchSlide();
    }
  },
  methods: {
    fetchSlide() {
      Vue.$http.get(`${process.env.apiMall}/advertisement/getAdvertisementInfo`, {
        params: {
          newsId: this.route.params.entryId
        }
      }).then((response) => {
        const article = response.data;
        this.adFrom.advertisementId = article.id;
        this.adFrom.imageId = article.imageId;
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
      this.adFrom['mallId'] = Number(localStorage.getItem('mallId'));

      Vue.$http.post(`${process.env.apiMall}/advertisement/addAdvertisement`, this.adFrom).then((response) => {
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
          message: `${error.response.data.message}`,
          type: 'error',
          offset: 30
        });
      })
    },
    saveChanges() {
      const meId = localStorage.getItem('meId');
      this.adFrom['identity'] = meId;
      this.adFrom['mallId'] = this.mallId;

      Vue.$http.post(`${process.env.apiMall}/advertisement/modifyAdvertisement`, this.adFrom).then((response) => {
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

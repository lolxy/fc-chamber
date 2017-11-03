/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';

export default {
  data() {
    return {
      catTypeId: '6e3cecaf-4d35-e711-80e4-da42ba972ebd',
      categoryId: 'fc696a99-3702-e711-80e3-850a1737545e',
      industryId: '6c4de88d-3702-e711-80e3-850a1737545e',
      stream: {
        content: null,
        typeId: null,
        catTypeId: null,
        categoryIds: [],
        industryIds: [],
        tagIds: [],
        images: [],
      },
      streamCats: {},
      streamCatTypes: [],
      streamTypes: [],
      streamTags: [],
      imageData: {},
      maxImageLength: 9,
      currentImageIndex: 0,
      previewImageUrl: null,
      onStreamEditing: false,
      imageUploaderStatus: false,
      previewDialogVisible: false,
      bucketHost: `${process.env.qiniuBucketHost}`,
    }
  },
  computed: {
    streamCatByIndustry() {
      const cats = this.streamCats[`cat-${this.categoryId}`].Categories.filter(item => item.ParentId === this.stream.catTypeId);
      if (this.stream.catTypeId) {
        return cats;
      }
      return [];
    }
  },
  mounted() {
    this.fetchStreamTypes();
    this.fetchStreamCatTypes();
    this.fetchStreamTags();
  },
  methods: {
    fetchStreamTypes() {
      Vue.$http.get('/MarketTalks/Types').then((response) => {
        this.streamTypes = response.data;
        this.stream.typeId = response.data[0].Id
      })
    },
    fetchStreamTags() {
      Vue.$http.get('/MarketTalks/Tags').then((response) => {
        this.streamTags = response.data;
      })
    },
    fetchStreamCatTypes() {
      Vue.$http.get('/MarketTalks/Categories/Types?fields=Categories').then((response) => {
        this.streamCatTypes = response.data;
        this.streamCatTypes.forEach((typeItem) => {
          Vue.set(this.streamCats, `cat-${typeItem.Id}`, typeItem);
          Vue.set(this.streamCats[`cat-${typeItem.Id}`], 'hasItems', false);

          const cats = typeItem.Categories;
          if (cats.length) {
            this.streamCats[`cat-${typeItem.Id}`].hasItems = true;
            if (cats[0].ParentId) {
              Vue.set(this.streamCats[`cat-${typeItem.Id}`], 'isSubType', true);
            }
          }
        })
      })
    },
    changeEditingStatus(status) {
      this.onStreamEditing = status;
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (this.stream.images.length < this.maxImageLength && this.currentImageIndex < this.maxImageLength) {
        if (isLt2M) {
          const prefix = new Date().getTime();
          const lastModified = file.lastModified;
          const suffix = file.name.split('.').pop();
          const key = encodeURI(`${prefix}_${lastModified}.${suffix}`);
          this.currentImageIndex += 1;
          return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
            this.upToken = response.data.Token;
            this.imageData = {
              key,
              token: this.upToken
            }
          })
        }
        if (!isLt2M) {
          this.$refs.imageUploader.clearFiles();
          this.$message.error('上传图片大小不能超过 2MB!');
        }
      } else {
        this.imageUploaderStatus = true;
        return false;
      }
    },
    handleSuccess(response, file, fileList) {
      const key = response.key
      const name = file.name
      const prefix = this.supportWebp ? 'webp/' : ''
      const img = {
        OriginalPath: `${this.bucketHost}/${prefix}${encodeURI(key)}`,
        Remark: null
      }
      if (this.stream.images.length < this.maxImageLength) {
        this.stream.images.push(img);
      }
    },
    handleRemove(file) {
      this.stream.images = this.stream.images.filter(item => item.OriginalPath !== `${this.bucketHost}/${file.response.key}`);
    },
    handleImagePreview(file) {
      this.previewImageUrl = file.url;
      this.previewDialogVisible = true;
    },
    onCatTypeIdChange(e, typeId) {
      this.stream.categoryIds = [];
    },
    createNewStream() {
      const companyId = localStorage.getItem('companyId');
      const meId = localStorage.getItem('meId');
      const categoryIds = this.stream.categoryIds.concat(this.stream.industryIds);
      Vue.$http.post('/MarketTalks', {
        CompanyId: companyId,
        SenderId: meId,
        TypeId: this.stream.typeId,
        CategoryIds: categoryIds,
        TagIds: this.stream.tagIds,
        Content: this.stream.content,
        Images: this.stream.images
      }).then((response) => {
        const streamId = response.data.Id;
        Vue.$http.get(`/MarketTalks/${streamId}`, {
          params: {
            fields: 'Sender.Company,Sender.Company.Categories,Sender.User,Images,Category,Type,Tags'
          },
        }).then((res) => {
          this.$emit('streamCreated', res.data);
        });
        this.resetForm();
      }).catch((error) => {
        this.$notify({
          type: 'error',
          title: '发布失败',
          message: error.response.data.Message,
          offset: 50,
        });
      })
    },
    resetForm() {
      this.stream.content = null;
      this.stream.catTypeId = null;
      this.stream.categoryIds = [];
      this.stream.industryIds = [];
      this.stream.tagIds = [];
      this.stream.images = [];
      this.onStreamEditing = false;
      this.currentImageIndex = 0;
      this.$refs.imageUploader.clearFiles();
    }
  }
};

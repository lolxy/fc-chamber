import Vue from 'vue';
require('font-awesome/css/font-awesome.css');
export default {
  name: 'topic-manager',
  data() {
    return {
      mall: {},
      articleForm: {
        title: null,
        abstract: null,
        content: null,
        cover: [],
        identity: null,
        mallId: null
      },
      fileList1:[],
      coverImage: {},
      imageData: {},
      uploadUrl: `${process.env.apiMall}/imgManager/adminUpLoadPic`,
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    }
  },
  mounted() {
    // this.addCustomFroalaButtons();
    if (this.route.name === 'mall.topic.edit') {
      this.fetchArticle();
    }
  },
  methods: {
    fetchArticle() {
      Vue.$http.get(`${process.env.apiMall}/community/show`, {
        params: {
          topicId: this.route.params.topicId
        }
      }).then((response) => {
        const article = response.data;
        this.articleForm.topicId = article.id;
        this.articleForm.title = article.title;
        this.articleForm.abstract = article.abstract;
        this.articleForm.content = article.content;
        this.articleForm.cover = article.cover;
        this.articleForm.identity = article.identity;
        this.articleForm.mallId = article.mallId;
        this.coverImage = article.cover;
        this.fetchImageList();
      })
    },
    fetchImageList() {
        this.fileList1=[];
        console.log(this.articleForm.cover);
        this.articleForm.cover.forEach((item)=>{
          console.log(item);
          this.fileList1 = this.fileList1.concat({"url":`${item}`});
        });
        console.log(this.fileList1);
    },
    handleChange(file, fileList) {
        this.fileList1=fileList
    },
    handleRemove(file,fileList){
      // console.log(file)
      this.$confirm('确定删除附件?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '暂不删除',
        type: 'error'
      }).then(() => {
        this.removeByValue(this.articleForm.cover,file.url);
      }).catch(()=>{
        this.fetchImageList();
      });
    },
    removeByValue(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
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
      const covers = image.url;
      // this.articleForm.cover = response.id;
      this.articleForm.cover = this.articleForm.cover.concat(covers);
      this.coverImage = this.articleForm.cover;
    },
    createNew() {
      const meId = localStorage.getItem('meId');
      this.articleForm['identity'] = meId;
      this.articleForm['mallId'] = Number(localStorage.getItem('mallId'));

      Vue.$http.post(`${process.env.apiMall}/community/create`, this.articleForm).then((response) => {
        this.$router.push({ name: 'mall.topic.edit', params: { topicId: response.data.id }})
      })
    },
    saveChanges() {
      const meId = localStorage.getItem('meId');
      this.articleForm['identity'] = meId;
      this.articleForm['topicId'] = this.route.params.topicId;
      Vue.$http.post(`${process.env.apiMall}/community/update`, this.articleForm).then((response) => {
        this.$notify({
          title: '文章更新成功',
          message: '这是一条成功的提示消息',
          type: 'success',
          offset: 88
        });
      })
    }
  }
};

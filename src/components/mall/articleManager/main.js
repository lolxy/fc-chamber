import Vue from 'vue';

// Require Froala Editor js file.
require('@/assets/js/froala/froala_editor.pkgd.min');
require('@/assets/js/froala/languages/zh_cn');

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css');
require('font-awesome/css/font-awesome.css');
require('froala-editor/css/froala_style.min.css');

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg';
Vue.use(VueFroala);

const imageManager = r => require.ensure([], () => r(require('@/components/mall/imageManager/main.vue')), 'image-manager');

export default {
  name: 'article-manager',
  data() {
    return {
      mall: {},
      config: {
        heightMin: 360,
        imageDefaultWidth: 500,
        imageDefaultAlign: 'left',
        requestWithCredentials: true,
        imageUploadURL: `${process.env.apiMall}/imgManager/adminUpLoadPic`,
        imageUploadParams: {identity: localStorage.getItem('meId')},
        imageMaxSize: 1024 * 1024 * 2,
        imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageManager'],
        imageManagerLoadURL: `${process.env.apiMall}/imgManager/getImage?page=0&singlePage=200`,
        imageManagerLoadParams: {identity: localStorage.getItem('meId')},
        language: 'zh_cn',
        placeholderText: '从这里开始写正文',
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|', 'insertLink', 'insertImage', '-', 'insertTable', 'insertHR', 'selectAll', 'clearFormatting', '|', 'help', 'html', '|', 'undo', 'redo']
      },
      articleForm: {
        title: '',
        content: '',
        abstractContent: '',
        cover: null,
        isTop: false,
        isPublish: true,
        identity: null,
        mallId: null,
        newsId:null
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
        abstractContent:[
          { max: 100, message: '文章概要不能超过100个字符', trigger: 'blur' }
        ]
      },
      coverImage: {},
      imageData: {},
      uploadUrl: `${process.env.apiMall}/imgManager/adminUpLoadPic`,
      imageManagerDialogVisible: false
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  components: {
    imageManager: imageManager,
  },
  mounted() {
    if (this.route.name === 'mall.article.edit') {
      this.fetchArticle();
    }
  },
  methods: {
    fetchArticle() {
      Vue.$http.get(`${process.env.apiMall}/news/show`, {
        params: {
          newsId: this.route.params.entryId
        }
      }).then((response) => {
        const article = response.data;
        this.articleForm.title = article.title;
        this.articleForm.content = article.content;
        this.articleForm.abstractContent = article.abstractContent;
        this.articleForm.cover = article.cover;
        this.articleForm.isTop = !!article.isTop;
        this.articleForm.isPublish = !!article.isPublish;
        this.articleForm.identity = article.identity;
        this.articleForm.mallId = article.mallId;
        this.coverImage = article.images;
      })
    },
    addCustomFroalaButtons() {
      const self = this;
      $.FroalaEditor.DefineIcon('customImageManager', {NAME: 'folder'});
      $.FroalaEditor.RegisterCommand('customImageManager', {
        title: '图片管理器',
        focus: false,
        undo: false,
        refreshAfterCallback: false,
        callback: function () {
          self.imageManagerDialogVisible = true
        }
      });
    },
    closeImageManagerDialog() {
      this.imageManagerDialogVisible = false;
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
      this.articleForm.cover = response.id;
      this.coverImage = image;
    },
    createNew(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const meId = localStorage.getItem('meId');
          this.articleForm['identity'] = meId;
          this.articleForm['mallId'] = Number(localStorage.getItem('mallId'));
          Vue.$http.post(`${process.env.apiMall}/news/create`, this.articleForm).then((response) => {
            this.$router.push({ name: 'mall.article.edit', params: { entryId: response.data.id }})
          }).catch((error)=>{
            this.$message({
              message: error.response.data.Message,
              type: 'error'
            });
          });
        } else {
          return false;
        }
      });
    },
    saveChanges() {
      const meId = localStorage.getItem('meId');
      this.articleForm['identity'] = meId;
      this.articleForm['newsId'] = this.route.params.entryId;
      Vue.$http.post(`${process.env.apiMall}/news/update`, this.articleForm).then((response) => {
        this.$notify({
          title: '文章更新成功',
          message: '这是一条成功的提示消息',
          type: 'success',
          offset: 88
        });
      })
    },
    previewThis() {
      this.$router.push({ name: 'mall.article.entry', params: { entryId: this.route.params.entryId }})
    }
  }
};

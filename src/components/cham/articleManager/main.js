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

const imageManager = r => require.ensure([], () => r(require('@/components/cham/imageManager/main.vue')), 'image-manager');
const categoryManager = r => require.ensure([], () => r(require('@/components/cham/categoryManager/main.vue')), 'category-manager');

export default {
  name: 'article-manager',
  data() {
    return {
      cham: {},
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
        cover: [],
        isTop: false,
        isPublish: true,
        identity: null,
        commerceChamberId: null,
        type:null,
        categoryId:null
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
        ],
        type: [
          { required: true, message: '请选择模块类型', trigger: 'change' }
        ],
        categoryId: [
          { type: 'number', required: true, message: '请选择分类', trigger: 'change' }
        ]
      },
      typeOptions:[
        {
          value: 'news',
          label: '资讯'
        }, {
          value: 'law',
          label: '法律'
        }, {
          value: 'tec',
          label: '新技术'
        }
      ],
      allCategoryLists:[],
      coverImage: [],
      imageData: {},
      uploadUrl: `${process.env.apiMall}/imgManager/adminUpLoadPic`,
      imageManagerDialogVisible: false,
      dialogCategoryVisible:false
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
  },
  components: {
    imageManager: imageManager,
    categoryManager:categoryManager
  },
  mounted() {
    this.fetchCategory();
    if (this.route.name === 'cham.article.edit') {
      this.fetchArticle();
    }
  },
  methods: {
    fetchCategory() {
      Vue.$http.get(`${process.env.apiCham}/category/lists`, {
        params: {
          commerceChamberId: this.chamId,
          type:'',
          isAll:1
        }
      }).then((response) => {
        this.allCategoryLists = response.data
      })
    },
    getFilterOptions(typename) {
      let allCategoryList = this.allCategoryLists;
      if(this.dialogCategoryVisible){
        return allCategoryList.filter((item) => item.type === typename);
      } else{
        return allCategoryList.filter((item) => {
          return item.type === typename && item.isUse
        });
      }
    },
    initSelectCategory() {
        this.articleForm.categoryId = null
    },
    fetchArticle() {
      Vue.$http.get(`${process.env.apiCham}/news/show`, {
        params: {
          newsId: this.route.params.entryId
        }
      }).then((response) => {
        const article = response.data;
        this.articleForm.newsId = article.id;
        this.articleForm.title = article.title;
        this.articleForm.content = article.content;
        this.articleForm.abstractContent = article.abstractContent;
        this.articleForm.cover = article.cover;
        this.articleForm.isTop = !!article.isTop;
        this.articleForm.isPublish = !!article.isPublish;
        this.articleForm.identity = article.identity;
        this.articleForm.type = article.type;
        this.articleForm.categoryId = article.categoryId;
        this.articleForm.commerceChamberId = article.commerceChamberId;
        this.coverImage = article.cover;
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
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        this.imageData['identity'] = this.meId
      } else {
        this.$refs.imageUploader.clearFiles();
        this.$message.error('上传图片大小不能超过 2MB!');
      }
    },
    handleSuccess(response) {
      const image = response;
      Vue.set(image, 'url', image.link);
      const covers = image.url;
      this.articleForm.cover = [covers];
      this.coverImage = [covers];
    },
    createNew(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.articleForm['identity'] = this.meId;
          this.articleForm['commerceChamberId'] = Number(localStorage.getItem('chamId'));
          this.articleForm['showType'] = 'single';
          Vue.$http.post(`${process.env.apiCham}/news/create`, this.articleForm).then((response) => {
            this.$router.push({ name: 'cham.article.edit', params: { entryId: response.data.id }})
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
      this.articleForm['identity'] = this.meId;
      this.articleForm['newsId'] = this.route.params.entryId;
      this.articleForm['showType'] = 'single';
      Vue.$http.post(`${process.env.apiCham}/news/update`, this.articleForm).then((response) => {
        this.$notify({
          title: '操作成功',
          message: '文章更新成功',
          type: 'success',
          offset: 88
        });
      })
    },
    previewThis() {
      this.$router.push({ name: 'cham.article.entry', params: { entryId: this.route.params.entryId }})
    },
  }
};

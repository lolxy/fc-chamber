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

export default {
  name: 'suggest-create',
  data() {
    return {
      config: {
        heightMin: 200,
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
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'insertImage', 'selectAll', 'clearFormatting', 'html']
      },
      suggestForm: {
        content: '',
        identity: null,
        commerceChamberId: null
      },
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  mounted() {

  },
  methods: {
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
    createNew() {
      const meId = localStorage.getItem('meId');
      this.suggestForm['identity'] = meId;
      this.suggestForm['commerceChamberId'] = this.chamId;
      Vue.$http.post(`${process.env.apiCham}/feedback/create`, this.suggestForm).then((response) => {
        this.$router.push({ name: 'cham.index', params: { chamId: this.chamId }})
      })
    },
    // saveChanges() {
    //   const meId = localStorage.getItem('meId');
    //   this.suggestForm['identity'] = meId;
    //   this.suggestForm['newsId'] = this.route.params.entryId;
    //   Vue.$http.post(`${process.env.apiCham}/news/update`, this.suggestForm).then((response) => {
    //     this.$notify({
    //       title: '文章更新成功',
    //       message: '这是一条成功的提示消息',
    //       type: 'success',
    //       offset: 88
    //     });
    //   })
    // }
  }
};

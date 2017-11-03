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
  name: 'comment-form',
  data() {
    return {
      config: {
        heightMin: 120,
        requestWithCredentials: true,
        language: 'zh_cn',
        placeholderText: '发表评论',
        toolbarButtons: ['undo', 'redo' , 'bold'],
        htmlAllowedTags: ['p'],
        pluginsEnabled: [],
        quickInsertButtons: []
      },
      rules:{
        content:[
            { required: true, message: '评论内容不能为空', trigger: 'blur' }
        ]
      },
      commentForm: {
        content: '',
        identity: null,
        mallId: null,
        topicId: null
      }
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    }
  },
  methods: {
    resetComment() {
      this.commentForm.content=''
    },
    addComment() {
      const meId = localStorage.getItem('meId');
      this.commentForm['identity'] = meId;
      this.commentForm['mallId'] = Number(localStorage.getItem('mallId'));
      this.commentForm['topicId'] = Number(this.route.params.topicId);

      this.$refs['commentForm'].validate((valid) => {
        if (valid) {
          Vue.$http.post(`${process.env.apiMall}/community/comment/create`, this.commentForm).then((response) => {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: '您已评论成功',
              offset: 50
            });
            this.resetComment();
            this.$emit('comments');
          }).catch((error) => {
            this.$notify({
              type: 'success',
              title: '操作失败',
              message: `${error.response.data.Message}`,
              offset: 50
            });
          })
        } else {
          return false;
        }
      });
    }
  }
};

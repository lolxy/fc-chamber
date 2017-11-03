import Vue from 'vue';
import _ from 'lodash';

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
  name: 'notice-manager',
  data() {
    return {
      config: {
        heightMin: 160,
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
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline']
      },
      noticeForm: {
        noticeId:null,
        title: null,
        content: null,
        identity: null,
        commerceChamberId: null,
        isPublish:true
      },
      rules:{
        title: [
          { required: true, message: '请输入通知公告标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入通知公告内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    entryId() {
      return this.$store.state.route.params.entryId;
    },
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    //do something after mounting vue instance
    if (this.route.name === 'cham.notice.edit') {
      this.fetchNotice();
    }
  },
  methods: {
    fetchNotice() {
      Vue.$http.get(`${process.env.apiCham}/notice/info`, {
        params: {
          noticeId: this.entryId,
          commerceChamberId:this.chamId,
          identity:this.meId
        }
      }).then((response) => {
        const notice = response.data;
        this.noticeForm.noticeId = notice.id;
        this.noticeForm.title = notice.title;
        this.noticeForm.content = notice.content;
        this.noticeForm.isPublish = notice.isPublish?true:false;
      })
    },
    saveChanges(formName) {
      this.noticeForm['identity'] = this.meId;
      this.noticeForm['noticeId'] = this.route.params.entryId;
      this.noticeForm['commerceChamberId'] = this.chamId;
      this.$refs[formName].validate((valid) => {
          if (valid) {
              Vue.$http.post(`${process.env.apiCham}/notice/update`, this.noticeForm).then((response) => {
                this.$notify({
                  title: '操作成功',
                  message: '通知公告更新成功',
                  type: 'success',
                  offset: 88
                });
              this.$router.push({ name: 'cham.notice.list'});
            }).catch((error)=>{
              this.$notify({
                type: 'error',
                title: '操作失败',
                message: error.response.data.Message,
                offset: 50
              })
            })
          } else {
            return false;
          }
      });
    },
    createNew(formName) {
      const meId = localStorage.getItem('meId');
      this.noticeForm['identity'] = meId;
      this.noticeForm['commerceChamberId'] = this.chamId;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            Vue.$http.post(`${process.env.apiCham}/notice/create`, this.noticeForm).then((response) => {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: '通知公告创建成功',
                offset: 50
              });
              this.$router.push({ name: 'cham.notice.list', params: { noticeId: response.data.id }})
            }).catch((error)=>{
              this.$notify({
                type: 'error',
                title: '操作失败',
                message: error.response.data.Message,
                offset: 50
              })
            })
          } else {
            return false;
          }
      });
    }
  }
}

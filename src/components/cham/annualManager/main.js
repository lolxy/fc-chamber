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
  name: 'annual-manager',
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
      annualForm: {
        summaryId:null,
        title: null,
        content: null,
        identity: null,
        commerceChamberId: null
      },
      rules:{
        title: [
          { required: true, message: '请输入年度总结标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入年度总结内容', trigger: 'blur' }
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
    if (this.route.name === 'cham.annual.edit') {
      this.fetchAnnual();
    }
  },
  methods: {
    fetchAnnual() {
      Vue.$http.get(`${process.env.apiCham}/summary/info`, {
        params: {
          summaryId: this.entryId,
          commerceChamberId:this.chamId,
          identity:this.meId
        }
      }).then((response) => {
        const annual = response.data;
        this.annualForm.summaryId = annual.id;
        this.annualForm.title = annual.title;
        this.annualForm.content = annual.content;
      })
    },
    saveChanges(formName) {
      this.annualForm['identity'] = this.meId;
      this.annualForm['summaryId'] = this.route.params.entryId;
      this.annualForm['commerceChamberId'] = this.chamId;
      this.$refs[formName].validate((valid) => {
          if (valid) {
              Vue.$http.post(`${process.env.apiCham}/summary/update`, this.annualForm).then((response) => {
                this.$notify({
                  title: '操作成功',
                  message: '年度总结更新成功',
                  type: 'success',
                  offset: 88
                });
              this.$router.push({ name: 'cham.annual.list'});
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
      this.annualForm['identity'] = meId;
      this.annualForm['commerceChamberId'] = this.chamId;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            Vue.$http.post(`${process.env.apiCham}/summary/create`, this.annualForm).then((response) => {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: '年度总结创建成功',
                offset: 50
              });
              this.$router.push({ name: 'cham.annual.list', params: { annualId: response.data.id }})
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

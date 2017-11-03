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
  name: 'mall-about',
  data() {
    return {
      about:[],
      aboutManagerVisible:false,
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
        toolbarButtons: ['bold','italic','underline','insertImage','insertTable','insertHR','clearFormatting','html']
      },
      aboutForm:{
        identity:null,
        id:null,
        introduction:''
      }
    }
  },
  computed: {
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  mounted() {
    this.fetchRules();
  },
  methods: {
    openRulesManagerDialog() {
      this.aboutManagerVisible = true;
      this.aboutForm.introduction = this.about.introduction;
    },
    saveChanges() {
      Vue.$http.put(`${process.env.apiMall}/mall/modifyMallAttribute`,{
          id:this.mallId,
          identity:this.meId,
          introduction:this.aboutForm.introduction
      }).then((response) => {
        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '商城简介更新成功！',
          offset: 50
        });
        this.aboutManagerVisible = false;
        this.fetchRules();
      });
    },
    fetchRules() {
      Vue.$http.get(`${process.env.apiMall}/mall/getMallDetail`,{
        params:{
          mallId:this.mallId
        }
      }).then((response) => {
        this.about = response.data;
      })
    }
  }
};

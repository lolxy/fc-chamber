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
  name: 'cham-rules',
  data() {
    return {
      rules:[],
      rulesManagerVisible:false,
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
      rulesForm:{
        commerceChamberId:null,
        content:'',
        type:'rules'
      }
    }
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  mounted() {
    this.fetchRules();
  },
  methods: {
    openRulesManagerDialog() {
      this.rulesManagerVisible = true;
      this.rulesForm.content = this.rules.content;
    },
    saveChanges() {
      Vue.$http.post(`${process.env.apiCham}/posts/store`,{
          commerceChamberId:this.chamId,
          type:'rules',
          identity:this.meId,
          content:this.rulesForm.content
      }).then((response) => {
        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '商会章程更新成功！',
          offset: 50
        });
        this.rulesManagerVisible = false;
        this.fetchRules();
      }).catch((error)=>{
        this.$notify({
          type: 'success',
          title: '操作失败',
          message: error.response.data.Message,
          offset: 50
        })
      });
    },
    fetchRules() {
      Vue.$http.get(`${process.env.apiCham}/posts/info`,{
        params:{
          commerceChamberId:this.chamId,
          type:'rules'
        }
      }).then((response) => {
        this.rules = response.data;
      })
    }
  }
};

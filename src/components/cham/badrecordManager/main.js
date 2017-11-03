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
  name: 'badrecord-manager',
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
      coverEditor: {
        upToken: null,
        isUploadShow: false,
        supportWebp: false,
        bucketHost: `${process.env.qiniuBucketHost}`,
        enclosure: {}
      },
      fileList1: [],
      badrecordForm: {
        companyName: null,
        companyAddress: null,
        contacts: null,
        shareContent: null,
        identity: null,
        commerceChamberId: null,
        enclosure:[]
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
  methods: {
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'||file.type ==='image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传附件只能是jpg或png的图片格式!');
      }else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }else{
        let prefix = new Date().getTime();
        let suffix = file.name;
        let key = encodeURI(`${prefix}_${suffix}`)
        return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
          this.coverEditor.upToken = response.data.Token;
          this.coverEditor.enclosure = {
            key,
            token: this.coverEditor.upToken
          }
        })
      }
    },
    handleChange(file, fileList) {
        this.fileList1=fileList
    },
    fetchImageList() {
      this.fileList1=[];
      this.badrecordForm.enclosure.forEach((item)=>{
        this.fileList1 = this.fileList1.concat({"url":`${item}`});
      });
    },
    handleRemove(file,fileList){
      this.$confirm('确定删除附件?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '暂不删除',
        type: 'error'
      }).then(() => {
        this.removeByValue(this.badrecordForm.enclosure, file.url);
      }).catch(()=>{
        this.fetchImageList();
      });
      // this.$confirm('确定删除附件?', '提示', {
      //   confirmButtonText: '确定删除',
      //   cancelButtonText: '暂不删除',
      //   type: 'error'
      // }).then(() => {
      //   this.badrecordForm.enclosure.splice(0,this.badrecordForm.enclosure.length);
      //   fileList.forEach((item)=>{
      //     this.badrecordForm.enclosure = this.badrecordForm.enclosure.concat(`${this.coverEditor.bucketHost}/${item.response.key}`);
      //   });
      // });
    },
    removeByValue(arr, val) {
      for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    },
    handleSuccess(response, file, fileList) {
      let key = response.key;
      let name = file.name;
      let prefix = this.coverEditor.supportWebp ? 'webp/' : '';
      this.badrecordForm.enclosure = this.badrecordForm.enclosure.concat(`${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`);
    },
    createNew() {
      const meId = localStorage.getItem('meId');
      this.badrecordForm['identity'] = meId;
      this.badrecordForm['commerceChamberId'] = this.chamId;
      Vue.$http.post(`${process.env.apiCham}/blackList/create`, this.badrecordForm).then((response) => {
        this.$notify({
          type: 'success',
          title: '操作成功',
          message: '不良记录创建成功',
          offset: 50
        });
        this.$router.push({ name: 'cham.badrecord.list', params: { badrecordId: response.data.id }})
      })
    }
  }
};

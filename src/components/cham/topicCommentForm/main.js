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
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough','align','insertLink', 'insertImage','clearFormatting','html'],
        htmlAllowedTags: ['p'],
        pluginsEnabled: [],
        quickInsertButtons: []
      },
      coverEditor: {
        upToken: null,
        isUploadShow: false,
        supportWebp: false,
        bucketHost: `${process.env.qiniuBucketHost}`,
        enclosure: {}
      },
      fileList1:[],
      rules:{
        content:[
            { required: true, message: '分享内容不能为空', trigger: 'blur' }
        ]
      },
      commentForm: {
        content: '',
        enclosure:[],
        identity: null,
        recordId: null,
        shareId:null
      }
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    }
  },
  // mounted() {
  //     if(this.items.length){
  //         this.fetchShareDetail()
  //     }
  // },
  watch: {
    items() {
      this.fetchShareDetail()
    }
  },
  props: ['items'],
  methods: {
    fetchShareDetail() {
      this.commentForm.content = this.items.content;
      this.commentForm.enclosure = this.items.enclosure;
      this.commentForm.shareId=this.items.id;
      this.fetchImageList();
    },
    fetchImageList() {
      this.fileList1=[];
      this.items.enclosure.forEach((item)=>{
        this.fileList1 = this.fileList1.concat({"url":`${item}`});
      });
    },
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
    handleRemove(file,fileList){
      this.$confirm('确定删除附件?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '暂不删除',
        type: 'error'
      }).then(() => {
        this.removeByValue(this.commentForm.enclosure, file.url);
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
    handleSuccess(response, file, fileList) {
      let key = response.key;
      let name = file.name;
      let prefix = this.coverEditor.supportWebp ? 'webp/' : '';
      this.commentForm.enclosure = this.commentForm.enclosure.concat(`${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`);
    },
    addComment() {
      const meId = localStorage.getItem('meId');
      this.commentForm['identity'] = meId;
      this.commentForm['recordId'] = Number(this.route.params.recordId);

      this.$refs['commentForm'].validate((valid) => {
          if (valid) {
            Vue.$http.post(`${process.env.apiCham}/blackList/comment`, this.commentForm).then((response) => {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: '不良记录评论成功',
                offset: 50
              });
              this.resetComment();
              this.$emit('badrecordComments');
            })
          } else {
            return false;
          }
        });
    },
    resetComment() {
      this.commentForm.content='',
      this.commentForm.enclosure=[],
      this.commentForm.identity=null,
      this.commentForm.recordId=null,
      this.commentForm.shareId=null;
      this.fileList1=[];
    },
    editComment() {
      const meId = localStorage.getItem('meId');
      this.commentForm['identity'] = meId;
      this.commentForm['shareId']=this.items.id;
      this.commentForm['recordId'] = Number(this.route.params.recordId);
      this.$refs['commentForm'].validate((valid) => {
        if (valid) {
          Vue.$http.post(`${process.env.apiCham}/blackList/updateShare`, this.commentForm).then((response) => {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: '不良记录评论修改成功',
              offset: 50
            });
            this.resetComment();
            this.$emit('badrecordComments');
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

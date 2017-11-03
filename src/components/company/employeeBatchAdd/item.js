import Vue from 'vue'
export default {
  data() {
    return {
      fileList: [],
      isShow:false,
      isDescriptShow:true,
      percent:0,
      filename:'',
      fileData:{},
      uploadResult:[],
      uploadUrl:`${process.env.apiRoot}/Employees/UploadempExcel`
    }
  },
  computed: {
    route() {
      return this.$store.state.route
    },
    me() {
      const cIndex = this.$store.state.myIdentities.cIndex
      const cIdentity = this.$store.state.myIdentities.list[cIndex]
      return cIdentity
    },
    companyId() {
      return this.$store.state.route.params.id
    },
    successUploadNum() {
      const sussessArr=this.uploadResult.filter((item) => item.Result);
      return sussessArr.length;
    }
  },
  mounted() {
    //do something after mounting vue instance
  },
  methods: {
    getEmpExcel() {
        window.location = `${process.env.downloadUrl}`
    },

    beforeExeclUpload(files) {
      this.fileData['CompanyId'] = this.companyId
    },
    handleExeclProgress(event, files, fileList){
      this.isShow = true
      this.filename=files.raw.name
      this.percent=event.percent
      if(event.percent === 100){
        setTimeout(() => {
          this.isShow = false
        }, 3000)
      }
    },
    handleExeclError(err, file, fileList){
      this.isShow = false;
      const errMsg = JSON.parse(err.message.replace('400 ', ''))
      this.$message({
        message: errMsg.Message,
        type: 'error'
      });
    },
    handleExeclSuccess(response, files, fileList) {
        this.uploadResult = response;
        this.isShow = false
        this.isDescriptShow=false
        this.$message({
          message:'员工批量导入成功！',
          type: 'success'
        });
        this.$emit("fetchEmployees");
    }
  }
}

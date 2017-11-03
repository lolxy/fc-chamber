import Vue from 'vue';

// Require Froala Editor css files.
require('font-awesome/css/font-awesome.css');

export default {
  name: 'apply-manager',
  data() {
    var validateIdentite = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请上传法人身份证正面照'));
      } else {
        if (this.applyForm.enclosureidentity === null) {
          this.$refs['imageIdentityUploader'].validateField('enclosureidentity');
        }
        callback();
      }
    };
    var validateLicense = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请上传营业执照'));
      } else {
        if (this.applyForm.enclosurelicense === null) {
          this.$refs['imageLicenseUploader'].validateField('enclosurelicense');
        }
        callback();
      }
    };
    return {
      applyForm: {
        companyName: '',
        address: '',
        phone: '',
        legalRepresentative:'',
        telephone:'',
        email:'',
        wechat:'',
        telefacsimile:'',
        balance:'',
        peopleNumber:'',
        enclosureidentity: null,
        enclosurelicense: null,
        identity: null,
        telefacsimile:'',
        commerceChamberId: null
      },
      rules: {
          companyName: [
            { required: true, message: '请输入单位名称', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入单位地址', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^0?(13|14|15|18)[0-9]{9}$/, message: '请输入正确格式的手机号码', trigger: 'blur' }
          ],
          legalRepresentative: [
            { required: true, message: '请输入法人代表', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入固定电话', trigger: 'blur' },
            { pattern: /^[0-9-()（）]{7,18}$/, message: '请输入正确格式的电话号码', trigger: 'blur' }
          ],
          telefacsimile: [
            { required: true, message: '请输入传真号码', trigger: 'blur' }
          ],
          email: [
            { type:'email', message: '您输入的邮箱格式不正确', trigger: 'blur' }
          ],
          enclosureidentity:[
            { validator: validateIdentite,message: '请上传法人身份证正面照',trigger: 'blur' }
          ],
          enclosurelicense:[
            { validator: validateLicense, message: '请上传营业执照', trigger: 'blur' }
          ]
        },
        imageData:{},
        imageIdentityImage: [],
        imageLicenseImage: [],
        uploadUrl: `${process.env.apiMall}/imgManager/adminUpLoadPic`,
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    meId() {
      return localStorage.getItem('meId');
    },
    chamId() {
      return this.$store.state.route.params.chamId
    }
  },
  methods: {
    beforeIdentityUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        this.imageData['identity'] = this.meId
      } else {
        this.$refs.imageIdentityUploader.clearFiles();
        this.$message.error('上传图片大小不能超过 2MB!');
      }
    },
    handleIdentitySuccess(response) {
      const image = response;
      Vue.set(image, 'url', image.link);
      const covers1 = image.url;
      this.applyForm.enclosureidentity = [covers1];
      this.imageIdentityImage = [covers1];
    },
    beforeLicenceUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        this.imageData['identity'] = this.meId
      } else {
        this.$refs.imageLicenceUploader.clearFiles();
        this.$message.error('上传图片大小不能超过 2MB!');
      }
    },
    handleLicenceSuccess(response) {
      const image = response;
      Vue.set(image, 'url', image.link);
      const covers2 = image.url;
      this.applyForm.enclosurelicense = [covers2];
      this.imageLicenseImage = [covers2];
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const meId = localStorage.getItem('meId');
          this.applyForm['identity'] = meId;
          this.applyForm['commerceChamberId'] = this.chamId;
          // this.applyForm['showType'] = 'single';
          Vue.$http.post(`${process.env.apiCham}/apply/create`, this.applyForm).then((response) => {
            this.$router.push({ name: 'cham.apply.entry', params: { entryId: response.data.id }})
          })
        } else {
          return false;
        }
      });
    }
  }
};

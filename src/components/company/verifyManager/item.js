/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

export default {
  data() {
    return {
      verifyForm: {
        Name: '',
        JobTitle: '',
        BusinessLicenceImgUrl: null,
        LegalPersonIdCard1: null,
        LegalPersonIdCard2: null
      },
      coverEditor: {
        upToken: null,
        isUploadShow: false,
        supportWebp: false,
        bucketHost: `${process.env.qiniuBucketHost}`,
        BusinessLicenceImage: {},
        LegalPersonIdCard1Image: {},
        LegalPersonIdCard2Image: {},
      },
      date: {
        date1: null,
        date2: null,
      },
    };
  },
  methods: {
    beforeBusinessLicenceUpload(file) {
      let prefix = new Date().getTime();
      let suffix = file.name;
      let key = encodeURI(`${prefix}_${suffix}`)
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        this.coverEditor.upToken = response.data.Token;
        this.coverEditor.BusinessLicenceImage = {
          key,
          token: this.coverEditor.upToken
        }
      })
    },
    handleBusinessLicenceSuccess(response, file, fileList) {
      let key = response.key;
      let name = file.name;
      let prefix = this.coverEditor.supportWebp ? 'webp/' : '';
      this.verifyForm.BusinessLicenceImgUrl = `${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`;
    },
    beforeLegalPersonIdCard1Upload(file) {
      let prefix = new Date().getTime();
      let suffix = file.name;
      let key = encodeURI(`${prefix}_${suffix}`)
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        this.coverEditor.upToken = response.data.Token;
        this.coverEditor.LegalPersonIdCard1Image = {
          key,
          token: this.coverEditor.upToken
        }
      })
    },
    handleLegalPersonIdCard1Success(response, file, fileList) {
      let key = response.key;
      let name = file.name;
      let prefix = this.coverEditor.supportWebp ? 'webp/' : '';
      this.verifyForm.LegalPersonIdCard1 = `${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`;
    },
    beforeLegalPersonIdCard2Upload(file) {
      let prefix = new Date().getTime();
      let suffix = file.name;
      let key = encodeURI(`${prefix}_${suffix}`)
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        this.coverEditor.upToken = response.data.Token;
        this.coverEditor.LegalPersonIdCard2Image = {
          key,
          token: this.coverEditor.upToken
        }
      })
    },
    handleLegalPersonIdCard2Success(response, file, fileList) {
      let key = response.key;
      let name = file.name;
      let prefix = this.coverEditor.supportWebp ? 'webp/' : '';
      this.verifyForm.LegalPersonIdCard2 = `${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`;
    },
    removeCover(image) {
      this.$confirm('确定移除该图片?', '提示', {
        confirmButtonText: '确定移除',
        cancelButtonText: '暂不移除',
        type: 'error'
      }).then(() => {
        image = null;
      });
    },
    onVerifySubmit() {
      const companyId = localStorage.getItem('companyId');
      Vue.set(this.verifyForm, 'Id', companyId);
      Vue.$http.post('/Companies', this.verifyForm).then((response) => {
        window.location.reload(true);
      })
    }
  }
};

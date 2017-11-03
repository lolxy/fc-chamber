/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';
import fetchProfileService from '@/services/my/profile/fetchMyProfile';

export default {
  data() {
    return {
      form: {
        name: null,
        gender: null,
        portraitUrl: null,
      },
      loaded: false,
      upToken: null,
      dialogImageUrl: '',
      dialogVisible: true,
      isUploadShow: false,
      imageData: {},
      uploadedImage: {},
      bucketHost: `${process.env.qiniuBucketHost}`,
    };
  },
  computed: {
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
  },
  beforeMount() {
    this.fetchMe();
  },
  methods: {
    fetchMe() {
      Vue.$http.get('/Account/Me', {
        params: {
          fields: 'RealName,Gender,PortraitUrl',
        },
      }).then((response) => {
        const me = response.data;

        this.form.name = me.RealName;
        this.form.gender = me.Gender;
        this.form.portraitUrl = me.PortraitUrl;

        this.loaded = true;
      });
    },
    updateProfile() {
      Vue.$http.post('Account/UpdateProfile', {
        RealName: this.form.name,
        Gender: this.form.gender,
        PortraitUrl: this.form.portraitUrl,
      }).then(() => {
        fetchProfileService();
        this.$notify({
          title: '更新成功',
          message: '您的个人资料更新成功',
          type: 'success',
          offset: 50
        });
      }).catch((error) => {
        this.$notify({
          title: '更新失败',
          message: error.response.data.Message,
          type: 'error',
          offset: 50
        });
      });
    },
    beforeUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        this.upToken = response.data.Token;
        this.imageData = {
          key,
          token: this.upToken,
        };
      });
    },
    handleSuccess(response, file, _fileList) {
      const key = response.key;
      const url = `${this.bucketHost}/${encodeURI(key)}`;
      this.form.portraitUrl = url;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};

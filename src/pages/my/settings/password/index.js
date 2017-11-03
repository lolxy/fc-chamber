/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

export default {
  data() {
    return {
      form: {
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null,
      },
      formRules: {
        newPassword: [
          { max: 22, message: '您设置的密码太长，建议8-16位字符', trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
  },
  beforeMount() {
  },
  methods: {
    updatePassword() {
      Vue.$http.post('Account/ChangePassword', {
        OldPassword: this.form.currentPassword,
        NewPassword: this.form.newPassword,
        ConfirmPassword: this.form.confirmNewPassword,
      }).then(() => {
        this.$message({ message: '更新成功' });
      }).catch((error) => {
        this.$message({ message: error.response.data.Message, type: 'error' })
      });
    },
  },
};

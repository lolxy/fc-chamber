/* ============
 * Login Index Page
 * ============
 *
 * Page where the user can login
 */
import Vue from 'vue';
import authService from '@/services/auth';

export default {
  data() {
    return {
      user: {
        phoneNumber: null,
        verifyCode: null,
        password: null,
        confirmPassword: null,
      },
      captchaCode: null,
      notThisNumber: false,
      verifyCodeStatus: true,
    };
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
  },
  methods: {
    login() {
      const self = this;
      authService.login({
        Account: self.user.phoneNumber,
        Password: self.user.password,
        RememberMe: true,
      });
    },
    captchaVerifyCode() {
      const captchaSrc = `${process.env.apiRoot}/VerifyCode/Img/GetRegisterVerifyCodeByPhone`;

      const captcha = this.$createElement('div',
        {
          class: 'captchaWrap',
          on: { click: this.refreshCaptcha }
        },
        [
          this.$createElement('div', {
            'class': 'captchaImg',
            'style': `background-image: url(${captchaSrc})`,
            on: { click: this.refreshCaptcha }
          }),
          this.$createElement('span', null, '看不清楚？点击刷新')
        ]
      );

      this.$prompt(captcha, '请输入下方的计算结果', {
        confirmButtonText: '获取短信验证码',
        showCancelButton: false
      }).then(({ value }) => {
        this.captchaCode = value;
        Vue.$http.get(`/VerifyCode/Check/GetResetPasswordVerifyCodeByPhone/${value}`).then((res) => {
          if (res.data === true) {
            this.getVerifyCodeByPhone();
          } else {
            this.$notify({
              title: '验证失败',
              message: '您填写的结果不正确',
              type: 'error',
              offset: 50
            });
          }
        })
      })
    },
    refreshCaptcha(e) {
      const captchaSrc = `${process.env.apiRoot}/VerifyCode/Img/GetResetPasswordVerifyCodeByPhone?t=${e.timeStamp}`;
      document.querySelector('.captchaImg').style.backgroundImage = `url(${captchaSrc})`;
    },
    getVerifyCodeByPhone() {
      const self = this;
      if (self.user.phoneNumber) {
        Vue.$http.get('/Account/GetResetPasswordVerifyCodeByPhone', {
          params: {
            phoneNumber: self.user.phoneNumber,
            VerifyCode: self.captchaCode
          },
        }).then((response) => {
          if (response == undefined) {
            self.notThisNumber = true;
          } else {
            self.notThisNumber = false;
          }
        }).catch((error) => {
          this.$notify({
            title: '获取失败',
            message: `${error.response.data.Message}`,
            type: 'error',
            offset: 50
          });
        })
      } else {
        this.$notify({
          title: '获取失败',
          message: '请填写您的手机号',
          type: 'error',
          offset: 50
        });
      }
    },
    checkVerifyCodeByPhone() {
      const self = this;
      Vue.$http.post('/Account/CheckResetPasswordVerifyCodeByPhone', {
        PhoneNumber: self.user.phoneNumber,
        VerifyCode: self.user.verifyCode,
      }).then((response) => {
        if (response == undefined) {
          self.verifyCodeStatus = false;
        } else {
          self.verifyCodeStatus = true;
          self.resetPassword();
        }
      });
    },
    resetPassword() {
      const self = this;
      Vue.$http.post('/Account/ResetPassword', {
        Account: self.user.phoneNumber,
        VerifyCode: self.user.verifyCode,
        NewPassword: self.user.password,
        ConfirmPassword: self.user.confirmPassword,
      }).then((response) => {
        self.login();
      });
    }
  },
};

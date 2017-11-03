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
        phoneNumber: '',
        verifyCode: null,
        password: null,
        confirmPassword: null,
        realName: ''
      },
      captchaCode: null,
      notThisNumber: false,
      verifyCodeStatus: true,
      verifyCounter: 60,
      verifyCounterText: 60,
      verifyBtnStatus: true,
      verifyErrorStatus: false
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
    verifyCountdown() {
      const self = this;
      self.verifyBtnStatus = false;
      const countdown = setInterval(function() {
        self.verifyCounter--;
        if(self.verifyCounter < 0) {
            self.verifyBtnStatus = true;
            clearInterval(countdown);
        } else {
            self.verifyCounterText = self.verifyCounter.toString();
        }
      }, 1000);
    },
    getVerifyCode(e) {
      e.preventDefault();
      this.captchaVerifyCode();
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
        Vue.$http.get(`/VerifyCode/Check/GetRegisterVerifyCodeByPhone/${value}`).then((res) => {
          if (res.data === true) {
            this.verifyIfRegistered();
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
      const captchaSrc = `${process.env.apiRoot}/VerifyCode/Img/GetRegisterVerifyCodeByPhone?t=${e.timeStamp}`;
      document.querySelector('.captchaImg').style.backgroundImage = `url(${captchaSrc})`;
    },
    verifyIfRegistered() {
      const self = this;
      Vue.$http.post('/Account/HasAccountByPhoneNumber', {
        PhoneNumber: self.user.phoneNumber
      }).then((response) => {
        if (response.data) {
          self.$notify({
            title: '已经是辅城用户',
            message: '无须重复注册:)',
            type: 'error',
            offset: 50
          });
        } else {
          self.getVerifyCodeByPhone();
        }
      }).catch((error) => {
        self.$notify({
          title: '出错啦!',
          message: `${error.response.data}`,
          type: 'error',
          offset: 50
        });
      })
    },
    getVerifyCodeByPhone() {
      const self = this;

      if (self.user.phoneNumber) {
        if (self.verifyBtnStatus) {
          self.verifyCounter = 60;
          self.verifyCounterText = 60;
          self.verifyCountdown();
        }
      
        Vue.$http.post('/Account/GetRegisterVerifyCodeByPhone', {
          PhoneNumber: self.user.phoneNumber,
          VerifyCode: self.captchaCode
        }).then((response) => {
          if (response == undefined) {
            self.notThisNumber = true;
          } else {
            self.notThisNumber = false;
          }
        }).catch((error) => {
          if (error.response.status == 400) {
            self.$notify({
              title: '获取验证码失败',
              message: `${error.response.data.Message}`,
              type: 'error',
              offset: 50
            });
          }
          if (error.response.status == 404) {
            self.verifyErrorStatus = true;
            self.$notify({
              title: '获取验证码失败',
              message: '请检查您的号码是否有误',
              type: 'error',
              offset: 50
            });
          }
        })
      }
    },
    checkVerifyCodeByPhone() {
      const self = this;
      Vue.$http.post('/Account/CheckRegisterVerifyCodeByPhone', {
        PhoneNumber: self.user.phoneNumber,
        VerifyCode: self.user.verifyCode,
      }).then((response) => {
        if (response == undefined) {
          self.verifyCodeStatus = false;
        } else {
          if (response.data) {
            self.verifyCodeStatus = true;
            self.registerNewAccount();
          } else {
            self.verifyCodeStatus = false;
            Vue.prototype.$notify({
              title: '验证码不正确',
              message: '请检查您输入的验证码是否正确!',
              type: 'error',
              offset: 50
            });
          }
        }
      })
    },
    registerNewAccount() {
      const self = this;
      Vue.$http.post('/Account/Register', {
        PhoneNumber: self.user.phoneNumber,
        VerifyCode: self.user.verifyCode,
        Password: self.user.password,
        RealName: self.user.realName,
      }).then((response) => {
        self.login();
      })
    }
  }
};

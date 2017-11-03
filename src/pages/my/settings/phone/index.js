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
        phoneNumber: null,
        verifyCode: null,
      },
      captchaCode: null,
      currentPhoneNumber: null,
    };
  },
  computed: {
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
  },
  beforeMount() {
    this.fetchPhone();
  },
  methods: {
    updatePhoneNumber() {
      Vue.$http.post('Account/SetPhoneNumber', {
        PhoneNumber: this.form.phoneNumber,
        VerifyCode: this.form.verifyCode,
      }).then(() => {
        this.$message({ message: '更新成功' });
      }).catch((error) => {
        this.$message({ message: error.response.data.Message, type: 'error' })
      });
    },
    fetchPhone() {
      Vue.$http.get('/Account/Me', {
        params: {
          fields: 'PhoneNumber',
        },
      }).then((response) => {
        const me = response.data;

        this.currentPhoneNumber = me.PhoneNumber;
      });
    },
    sendVerifyCode() {
      Vue.$http.post('Account/GetSetPhoneNumberVerifyCode', {
        PhoneNumber: this.form.phoneNumber,
      }).then(() => {
        Vue.prototype.$notify({
          title: '发送成功',
          message: '验证码已成功发送',
          type: 'success',
          offset: 50
        });
      }).catch((error) => {
        Vue.prototype.$notify({
          title: '发送失败',
          message: `${error.response.data.Message}`,
          type: 'error',
          offset: 50
        });
      });
    },
    captchaVerifyCode() {
      const captchaSrc = `${process.env.apiRoot}/VerifyCode/Img/GetSetPhoneNumberVerifyCode`;

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
        Vue.$http.get(`/VerifyCode/Check/GetSetPhoneNumberVerifyCode/${value}`).then((res) => {
          if (res.data === true) {
            this.sendVerifyCode();
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
    }
  },
};

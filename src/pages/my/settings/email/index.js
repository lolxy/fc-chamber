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
        email: null,
      },
    };
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
  },
  beforeMount() {
    this.fetchEmail();
  },
  methods: {
    updateEmail() {
      Vue.$http.post('Account/SetEmail', {
        Email: this.form.email,
      }).then(() => {
        this.$message({ message: '更新成功' });
      }).catch((error) => {
        this.$message({ message: error.response.data.Message, type: 'error' });
      });
    },
    fetchEmail() {
      Vue.$http.get('/Account/Me', {
        params: {
          fields: 'Email',
        },
      }).then((response) => {
        const me = response.data;

        this.form.email = me.Email;

        this.loaded = true;
      });
    }
  },
};

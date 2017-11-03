/* ============
 * Stream Item
 * ============
 *
 */

export default {
  data() {
    return {
      loginDialogVisible: false
    }
  },
  components: {
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
  },
  methods: {
    openLoginDialog() {
      this.loginDialogVisible = true;
    }
  }
};

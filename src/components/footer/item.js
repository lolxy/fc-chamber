/* ============
 * Footer Component
 * ============
 */

export default {
  name: 'footer',
  computed: {
    thisYear() {
      return new Date().getFullYear();
    }
  }
};

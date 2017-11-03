
const cookie = {
  setCookie(name, value) {
    const days = 365;
    const exp = new Date();
    exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=/;domain=.fccn.cc`;
  },
  readCookie(name) {
    let arr = null;
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    arr = document.cookie.match(reg);
    if (document.cookie && arr) {
      return unescape(arr[2]);
    }
    return null;
  },
  delCookie(name) {
    const cval = this.readCookie(name);
    if (cval != null) {
      document.cookie = `${name}=${cval};expires=${(new Date(0)).toGMTString()};path=/;domain=.fccn.cc`;
    }
  }
};

export default cookie;

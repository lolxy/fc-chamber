/* ============
 * Bootstrap File
 * ============
 *
 * Will configure and bootstrap the application
 */


/* ============
 * Vue
 * ============
 *
 * Vue.js is a library for building interactive web interfaces.
 * It provides data-reactive components with a simple and flexible API.
 *
 * http://rc.vuejs.org/guide/
 */
import Vue from 'vue';


Vue.config.debug = process.env.NODE_ENV !== 'production';

const bus = new Vue();

// Bind the event bus to Vue.
Vue.$bus = bus;
Object.defineProperty(Vue.prototype, '$bus', {
  get() {
    return bus;
  },
});


/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */
import Axios from 'axios';
// import authService from '@/services/auth';

Axios.defaults.baseURL = process.env.apiRoot;
Axios.defaults.headers.common.Accept = 'application/json';
Axios.defaults.withCredentials = true;
// Axios.interceptors.response.use(response => response, (error) => {
//   if (error.response.status === 401) {
//     authService.logout();
//   }
//   return Promise.reject(error);
// });
Vue.$http = Axios;


/* ============
 * Vuex Router Sync
 * ============
 *
 * Effortlessly keep vue-Router and vuex store in sync.
 *
 * https://github.com/vuejs/vuex-router-sync/blob/master/README.md
 */
import VuexRouterSync from 'vuex-router-sync';
import store from '@/store';

store.dispatch('auth/check');


/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */
import VueRouter from 'vue-router';
import routes from '@/routes';

Vue.use(VueRouter);

export const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth) && !store.state.auth.authenticated) {
    next({
      name: 'login.index',
    });
  } else {
    next();
  }
});

VuexRouterSync.sync(store, router);

Vue.router = router;


/* ============
 * Lazyload
 * ============
 *
 * Require Lazyload
 *
 * https://github.com/hilongjw/vue-lazyload
 */
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTNCRkE1RkQxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTNCRkE1RkUxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGQTVGQjFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGQTVGQzFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjAWWV4AAAANSURBVHjaY2BgYOAFAAASAA4rpYR1AAAAAElFTkSuQmCC',
  loading: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTNCRkE1RkQxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTNCRkE1RkUxRTU5MTFFN0JCNTNCQTIyRkM0MDAzM0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGQTVGQjFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGQTVGQzFFNTkxMUU3QkI1M0JBMjJGQzQwMDMzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjAWWV4AAAANSURBVHjaY2BgYOAFAAASAA4rpYR1AAAAAElFTkSuQmCC',
  attempt: 1
});


/* ============
 * vue-scrollto
 * ============
 *
 * https://github.com/rigor789/vue-scrollTo
 */
import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo);


/* ============
 * contextMenu
 * ============
 *
 * https://github.com/vmaimone/vue-context-menu
 */
import contextMenu from 'vue-context-menu';

Vue.use(contextMenu);


/* ============
 * jQuery
 * ============
 *
 * Require jQuery
 *
 * http://jquery.com/
 */
import jQuery from 'jquery';

window.$ = window.jQuery = jQuery;


/* ============
* Lodash
* ============
*
* Require lodash
*
* https://lodash.com/
*/
window._ = require('lodash');


/* ============
 * Vuex Timeago
 * ============
 *
 * A timeago component for Vue 1 and Vue 2.
 *
 * https://github.com/egoist/vue-timeago
 */
import VueTimeago from 'vue-timeago';

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json'),
  },
});


/* ============
 * Element UI
 * ============
 *
 * http://element.eleme.io/
 */
import { Col, Collapse, CollapseItem, DatePicker, Dialog, Dropdown, DropdownMenu, Table, TableColumn, DropdownItem, Alert, Input, InputNumber, Radio, RadioGroup, RadioButton, Checkbox, CheckboxGroup, Switch, Select, Option, OptionGroup, Button, ButtonGroup, Popover, Tooltip, Form, FormItem, Tabs, TabPane, Tag, TimePicker, Icon, Upload, Pagination, Progress, Spinner, Cascader, Loading, Message, MessageBox, Notification } from 'element-ui';

Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Alert);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(TimePicker);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Pagination);
Vue.use(Spinner);
Vue.use(Cascader);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;


/* ============
 * Vue preview plugin
 * ============
 *
 * 一个Vue集成PhotoSwipe图片预览插件
 *
 * https://github.com/LS1231/vue-preview
 */
import VuePreview from 'vue-preview';

Vue.use(VuePreview);


/* ============
 * Bootstrap
 * ============
 *
 * Require bootstrap
 *
 * http://getbootstrap.com/
 */
require('bootstrap');
require('bootstrap/less/bootstrap.less');

/* ============
 * Vue-Awesome-Swiper
 * ============
 *
 */
require('swiper/dist/css/swiper.css');

/* ============
 * Font Awesome
 * ============
 *
 * Require font-awesome
 *
 * http://http://fontawesome.io/
 */
require('font-awesome/less/font-awesome.less');


/* ============
 * Template Angulr Style
 * ============
 *
 * https://themeforest.net/item/angulr-bootstrap-admin-web-app-with-angularjs/8437259
 */
require('./assets/css/font.css');
require('./assets/css/app.css');
// require('./assets/css/xeditable.css');


/* ============
 * Custom Global CSS
 * ============
 */
require('./assets/css/global.css');

export default {
  router,
};

/* ============
* Custom Directives
* ============
*
* Require directives
*
* https://vuejs.org/v2/guide/custom-directive.html
*/
Vue.directive('dropdown', {
  bind(el) {
    jQuery(el).dropdown();
  },
});

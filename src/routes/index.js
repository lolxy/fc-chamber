/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */


/**
 * The routes
 *
 * @type {object} The routes
 */
const homePage = r => require.ensure([], () => r(require('@/pages/home/index/index.vue')), 'homePage');
// const Error404 = r => require.ensure([], () => r(require('@/pages/error/404.vue')), 'error-404');
const chamberHomePage = r => require.ensure([], () => r(require('@/pages/index/index.vue')), 'chamber-home-page');
// 商会架构和商会章程
const chamAbout = r => require.ensure([], () => r(require('@/pages/about/main.vue')), 'chamber-about');
const chamOrganization = r => require.ensure([], () => r(require('@/pages/organization/main.vue')), 'chamber-organization');
const chamNews = r => require.ensure([], () => r(require('@/pages/newslist/main.vue')), 'chamber-news');
const chamLaw = r => require.ensure([], () => r(require('@/pages/newslist/main.vue')), 'chamber-law');
const chamTec = r => require.ensure([], () => r(require('@/pages/newslist/main.vue')), 'chamber-tec');
const chamMember = r => require.ensure([], () => r(require('@/pages/member/main.vue')), 'chamber-member');
const chamNotice = r => require.ensure([], () => r(require('@/pages/notice/main.vue')), 'chamber-notice');
const NewEntry = r => require.ensure([], () => r(require('@/pages/newentry/main.vue')), 'chamber-newentry');
const chamApply = r => require.ensure([], () => r(require('@/pages/apply/main.vue')), 'chamber-apply');
const chamNoticeDetail = r => require.ensure([], () => r(require('@/pages/noticedetail/main.vue')), 'chamber-noticedetail');
const chamSearch = r => require.ensure([], () => r(require('@/pages/search/main.vue')), 'chamber-search');
/**
 * The routes
 *
 * @type {object} The routes
 */
export default [
  // Home
  {
    path: '/home',
    name: 'home.index',
    component: homePage,
    meta: {
      guest: true,
    },
  },
  {
    path: '/chamber/:chamId',
    name: 'chamber.index',
    component: chamberHomePage,
    meta: {
      guest: true
    },
    children: [
      {
        path: 'search',
        name: 'chamber.search',
        component: chamSearch,
        meta: {
          guest: true,
        },
      },
      {
        path: 'about',
        name: 'chamber.about',
        component: chamAbout,
        meta: {
          guest: true,
        },
      },
      {
        path: 'organization',
        name: 'chamber.organization',
        component: chamOrganization,
        meta: {
          guest: true,
        },
      },
      {
        path: 'news',
        name: 'chamber.news',
        component: chamNews,
        meta: {
          guest: true,
        },
      },
      {
        path: 'law',
        name: 'chamber.law',
        component: chamLaw,
        meta: {
          guest: true,
        },
      },
      {
        path: 'tec',
        name: 'chamber.tec',
        component: chamTec,
        meta: {
          guest: true,
        },
      },
      {
        path: 'apply',
        name: 'chamber.apply',
        component: chamApply,
        meta: {
          guest: true,
        },
      },
      {
        path: 'notice',
        name: 'chamber.notice',
        component: chamNotice,
        meta: {
          guest: true,
        },
      },
      {
        path: 'noticedetail/:entryId',
        name: 'chamber.noticedetail',
        component: chamNoticeDetail,
        meta: {
          guest: true,
        },
      },
      {
        path: 'newentry/:entryId',
        name: 'chember.newentry',
        component: NewEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'member',
        name: 'chamber.member',
        component: chamMember,
        meta: {
          guest: true,
        },
      },
    ]
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/*',
    redirect: '/home',
  }
];

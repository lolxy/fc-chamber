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

// Home Page
const homePage = r => require.ensure([], () => r(require('@/pages/home/index/index.vue')), 'homePage');

// Stream Market
const streamMarket = r => require.ensure([], () => r(require('@/pages/stream/market/index.vue')), 'stream-market');

// Access
const passwordReset = r => require.ensure([], () => r(require('@/pages/access/password/reset/index.vue')), 'access');
const signupIndex = r => require.ensure([], () => r(require('@/pages/access/signup/index/index.vue')), 'access');

// company Find
const companies = r => require.ensure([], () => r(require('@/pages/company/list/index.vue')), 'company-list');

// company Index
const companyIndex = r => require.ensure([], () => r(require('@/pages/company/index/index.vue')), 'company-index');
const companyProfile = r => require.ensure([], () => r(require('@/components/company/companyProfile/item.vue')), 'company-profile');
const companyProducts = r => require.ensure([], () => r(require('@/components/company/companyProducts/item.vue')), 'company-products');
const companyStream = r => require.ensure([], () => r(require('@/components/company/companyStream/item.vue')), 'company-stream');
const companyEmployee = r => require.ensure([], () => r(require('@/components/company/companyEmployee/item.vue')), 'company-employee');
const companyRbac = r => require.ensure([], () => r(require('@/components/company/companyRbac/item.vue')), 'company-rbac');
const companyProductEntry = r => require.ensure([], () => r(require('@/components/company/companyProductEntry/item.vue')), 'company-product-entry');

const companyAuctions = r => require.ensure([], () => r(require('@/pages/company/auctions/index.vue')), 'company-auctions');
const companyBiddings = r => require.ensure([], () => r(require('@/pages/company/biddings/index.vue')), 'company-biddings');

const companyProduct = r => require.ensure([], () => r(require('@/pages/company/product/index.vue')), 'company-product');
const companyNew = r => require.ensure([], () => r(require('@/pages/company/new/index.vue')), 'company-new');

// My settings
const mySettingsProfile = r => require.ensure([], () => r(require('@/pages/my/settings/profile/index.vue')), 'my-profile-settings');
const mySettingsPassword = r => require.ensure([], () => r(require('@/pages/my/settings/password/index.vue')), 'my-password-settings');
const mySettingsEmail = r => require.ensure([], () => r(require('@/pages/my/settings/email/index.vue')), 'my-email-settings');
const mySettingsPhone = r => require.ensure([], () => r(require('@/pages/my/settings/phone/index.vue')), 'my-phone-settings');

// My companies
const myCompaniesIndex = r => require.ensure([], () => r(require('@/pages/my/companies/index/index.vue')), 'my-companies');

// Circles Friend Streawm
const circlesFriendStream = r => require.ensure([], () => r(require('@/pages/circles/friends/stream/index.vue')), 'circles-friends-stream');

// Circles Auctions
const circlesAuctions = r => require.ensure([], () => r(require('@/pages/circles/auctions/list/index.vue')), 'circles-auctions');
const circlesAuctionsDetail = r => require.ensure([], () => r(require('@/pages/circles/auctions/detail/index.vue')), 'circles-auctions-detail');

// Circles Biddings
const circlesBiddings = r => require.ensure([], () => r(require('@/pages/circles/biddings/list/index.vue')), 'circles-biddings');
const circlesBiddingsDetail = r => require.ensure([], () => r(require('@/pages/circles/biddings/detail/index.vue')), 'circles-biddings-detail');

// Circles Following
const circlesFollowingStream = r => require.ensure([], () => r(require('@/pages/circles/following/stream/index.vue')), 'circles-following-stream');
const circlesFollowingList = r => require.ensure([], () => r(require('@/pages/circles/following/list/index.vue')), 'circles-following-list');

// Articles
const ArticlesList = r => require.ensure([], () => r(require('@/pages/articles/list/index.vue')), 'articles-list');
const ArticlesEntry = r => require.ensure([], () => r(require('@/pages/articles/entry/index.vue')), 'articles-entry');

// workTasks
const workTasks = r => require.ensure([], () => r(require('@/pages/oa/worktasks/list/index.vue')), 'work-tasks');
const workTasksEntry = r => require.ensure([], () => r(require('@/pages/oa/worktasks/entry/index.vue')), 'work-tasks-entry');


// mall
const mallIndex = r => require.ensure([], () => r(require('@/pages/mall/index/index.vue')), 'mall-index');

const mallArticleNew = r => require.ensure([], () => r(require('@/pages/mall/articles/manager/main.vue')), 'mall-article-new');
const mallArticleEdit = r => require.ensure([], () => r(require('@/pages/mall/articles/manager/main.vue')), 'mall-article-edit');

const mallArticleList = r => require.ensure([], () => r(require('@/pages/mall/articles/list/main.vue')), 'mall-article-list');
const mallArticleEntry = r => require.ensure([], () => r(require('@/pages/mall/articles/entry/main.vue')), 'mall-article-entry');

const mallTopicNew = r => require.ensure([], () => r(require('@/pages/mall/topic/manager/main.vue')), 'mall-Community-new');
const mallTopicEdit = r => require.ensure([], () => r(require('@/pages/mall/topic/manager/main.vue')), 'mall-Community-edit');

const mallTopic = r => require.ensure([], () => r(require('@/pages/mall/topic/list/main.vue')), 'mall-community-list');
const mallTopicEntry = r => require.ensure([], () => r(require('@/pages/mall/topic/entry/main.vue')), 'mall-community-entry');

const mallCompanies = r => require.ensure([], () => r(require('@/pages/mall/companies/list/main.vue')), 'mall-companies-list');
const mallRecommend = r => require.ensure([], () => r(require('@/pages/mall/recommend/list/main.vue')), 'mall-recommend-list');

// cham
const chamIndex = r => require.ensure([], () => r(require('@/pages/cham/index/index.vue')), 'cham-index');
const chamArticleNew = r => require.ensure([], () => r(require('@/pages/cham/articles/manager/main.vue')), 'cham-article-new');
const chamArticleEdit = r => require.ensure([], () => r(require('@/pages/cham/articles/manager/main.vue')), 'cham-article-edit');
const chamArticleList = r => require.ensure([], () => r(require('@/pages/cham/articles/list/main.vue')), 'cham-article-list');
const chamArticleEntry = r => require.ensure([], () => r(require('@/pages/cham/articles/entry/main.vue')), 'cham-article-entry');

// cham-apply
const chamApplyNew = r => require.ensure([], () => r(require('@/pages/cham/apply/manager/main.vue')), 'cham-apply-new');
const chamApplyList = r => require.ensure([], () => r(require('@/pages/cham/apply/list/main.vue')), 'cham-apply-list');
const chamApplyEntry = r => require.ensure([], () => r(require('@/pages/cham/apply/entry/main.vue')), 'cham-apply-entry');

// cham-annual
const chamAnnualNew = r => require.ensure([], () => r(require('@/pages/cham/annual/manager/main.vue')), 'cham-annual-new');
const chamAnnualList = r => require.ensure([], () => r(require('@/pages/cham/annual/list/main.vue')), 'cham-annual-list');
const chamAnnualEntry = r => require.ensure([], () => r(require('@/pages/cham/annual/entry/main.vue')), 'cham-annual-entry');
const chamAnnualEdit = r => require.ensure([], () => r(require('@/pages/cham/annual/manager/main.vue')), 'cham-annual-edit');

// cham-notice
const chamNoticeNew = r => require.ensure([], () => r(require('@/pages/cham/notice/manager/main.vue')), 'cham-notice-new');
const chamNoticeList = r => require.ensure([], () => r(require('@/pages/cham/notice/list/main.vue')), 'cham-notice-list');
const chamNoticeEntry = r => require.ensure([], () => r(require('@/pages/cham/notice/entry/main.vue')), 'cham-notice-entry');
const chamNoticeEdit = r => require.ensure([], () => r(require('@/pages/cham/notice/manager/main.vue')), 'cham-notice-edit');

// cham-suggest
const chamSuggestList = r => require.ensure([], () => r(require('@/pages/cham/suggest/list/main.vue')), 'cham-suggest-list');
const chamSuggestCreate = r => require.ensure([], () => r(require('@/pages/cham/suggest/list/main.vue')), 'cham-suggest-create');

const chamCompanies = r => require.ensure([], () => r(require('@/pages/cham/companies/list/main.vue')), 'cham-companies-list');
const chamRecommend = r => require.ensure([], () => r(require('@/pages/cham/recommend/list/main.vue')), 'cham-recommend-list');
const chamSite = r => require.ensure([], () => r(require('@/pages/cham/site/list/main.vue')), 'cham-site-list');

const chamBadRecordNew = r => require.ensure([], () => r(require('@/pages/cham/badrecord/manager/main.vue')), 'cham-badrecord-new');
const chamBadRecord = r => require.ensure([], () => r(require('@/pages/cham/badrecord/list/main.vue')), 'cham-badrecord-list');
const chamBadRecordEntry = r => require.ensure([], () => r(require('@/pages/cham/badrecord/entry/main.vue')), 'cham-badrecord-entry');

// 商会架构和商会章程
const chamAbout = r => require.ensure([], () => r(require('@/pages/cham/about/main.vue')), 'cham-about');
const mallAbout = r => require.ensure([], () => r(require('@/pages/mall/about/main.vue')), 'mall-about');

// OA Exports
const OAIndex = r => require.ensure([], () => r(require('@/pages/oa/index/index.vue')), 'oa-index');
const OAExportCheckIn = r => require.ensure([], () => r(require('@/pages/oa/export/checkin/index.vue')), 'oa-export-checkin');
const OAExportCost = r => require.ensure([], () => r(require('@/pages/oa/export/cost/index.vue')), 'oa-export-cost');
const OAExportLeave = r => require.ensure([], () => r(require('@/pages/oa/export/leave/index.vue')), 'oa-export-leave');
const OAExportReimbursement = r => require.ensure([], () => r(require('@/pages/oa/export/reimbursement/index.vue')), 'oa-export-reimbursement');
const OAExportPurchases = r => require.ensure([], () => r(require('@/pages/oa/export/purchases/index.vue')), 'oa-export-purchases');
const OAExportBusinessTravels = r => require.ensure([], () => r(require('@/pages/oa/export/businessTravels/index.vue')), 'oa-export-businessTravels');
const OAExportOverTimes = r => require.ensure([], () => r(require('@/pages/oa/export/overTimes/index.vue')), 'oa-export-overTimes');

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

  // company
  {
    path: '/company/:id',
    name: 'company.index',
    component: companyIndex,
    meta: {
      guest: true,
    },
    children: [
      {
        path: 'profile',
        name: 'company.profile',
        component: companyProfile,
        meta: {
          guest: true,
        },
      },
      {
        path: 'products',
        name: 'company.products',
        component: companyProducts,
        meta: {
          guest: true,
        },
      },
      {
        path: 'product/:productId',
        name: 'product.entry',
        component: companyProductEntry,
        meta: {
          guest: true,
        },
      },
      {
        path: 'stream',
        name: 'company.stream',
        component: companyStream,
        meta: {
          guest: true,
        },
      },
      {
        path: 'employee',
        name: 'company.employee',
        component: companyEmployee,
        meta: {
          guest: true,
        },
      },
      {
        path: 'rbac',
        name: 'company.rbac',
        component: companyRbac,
        meta: {
          auth: true,
        },
      },
      {
        path: 'auctions',
        name: 'company.auctions',
        component: companyAuctions,
        meta: {
          guest: true,
        },
      },
      {
        path: 'biddings',
        name: 'company.biddings',
        component: companyBiddings,
        meta: {
          guest: true,
        },
      }
    ]
  },

  // company New
  {
    path: '/company-new',
    name: 'company.new',
    component: companyNew,
    meta: {
      auth: true,
    },
  },

  // company Product
  {
    path: '/company/product/:productId',
    name: 'company.product',
    component: companyProduct,
    meta: {
      guest: true,
    },
  },

  // companies
  {
    path: '/companies',
    name: 'companies',
    component: companies,
    meta: {
      guest: true,
    },
  },

  // My Settings
  {
    path: '/my/settings/profile',
    name: 'my.settings.profile',
    component: mySettingsProfile,
    meta: {
      auth: true,
    },
  },
  {
    path: '/my/settings/password',
    name: 'my.settings.password',
    component: mySettingsPassword,
    meta: {
      auth: true,
    },
  },
  {
    path: '/my/settings/email',
    name: 'my.settings.email',
    component: mySettingsEmail,
    meta: {
      auth: true,
    },
  },
  {
    path: '/my/settings/phone',
    name: 'my.settings.phone',
    component: mySettingsPhone,
    meta: {
      auth: true,
    },
  },

  // My companies
  {
    path: '/my/companies',
    name: 'my.companies',
    component: myCompaniesIndex,
    meta: {
      auth: true,
    },
  },

  // Circles Friends
  {
    path: '/circles/friends',
    name: 'circles.friends.stream',
    component: circlesFriendStream,
    meta: {
      auth: true,
    },
  },

  // Work Tasks
  {
    path: '/oa/work-tasks',
    name: 'worktasks',
    component: workTasks,
    meta: {
      auth: true,
    },
  },

  // Work Tasks
  {
    path: '/oa/work-tasks/:slug',
    name: 'worktasks.list',
    component: workTasks,
    meta: {
      auth: true,
    },
  },

  // Work Tasks Entry
  {
    path: '/oa/work-tasks/detail/:taskId',
    name: 'worktasks.entry',
    component: workTasksEntry,
    meta: {
      auth: true,
    },
  },

  // Circles auctions
  {
    path: '/circles/auctions',
    name: 'circles.auctions',
    component: circlesAuctions,
    meta: {
      guest: true,
    },
  },

  // Circles auctions
  {
    path: '/circles/auctions/:slug',
    name: 'circles.auctions.list',
    component: circlesAuctions,
    meta: {
      guest: true,
    },
  },

  // Auction Detail
  {
    path: '/circles/auctions/detail/:id',
    name: 'circles.auctions.detail',
    component: circlesAuctionsDetail,
    meta: {
      guest: true,
    },
  },

  // Circles Biddings
  {
    path: '/circles/biddings',
    name: 'circles.biddings',
    component: circlesBiddings,
    meta: {
      guest: true,
    },
  },

  // Circles Biddings
  {
    path: '/circles/biddings/:slug',
    name: 'circles.biddings.list',
    component: circlesBiddings,
    meta: {
      guest: true,
    },
  },

  // Biddings Detail
  {
    path: '/circles/biddings/detail/:id',
    name: 'circles.biddings.detail',
    component: circlesBiddingsDetail,
    meta: {
      guest: true,
    },
  },

  // Circles Following Stream
  {
    path: '/circles/following',
    name: 'circles.following.stream',
    component: circlesFollowingStream,
    meta: {
      auth: true,
    },
  },

  // Circles Following List
  {
    path: '/circles/following/list',
    name: 'circles.following.list',
    component: circlesFollowingList,
    meta: {
      auth: true,
    },
  },

  // Market stream
  {
    path: '/stream/market',
    name: 'stream.market',
    component: streamMarket,
    meta: {
      guest: true,
    },
  },

  // Articles Index
  {
    path: '/articles',
    name: 'articles.index',
    component: ArticlesList,
    meta: {
      guest: true,
    },
  },

  // Articles list
  {
    path: '/articles/:categoryId',
    name: 'articles.list',
    component: ArticlesList,
    meta: {
      guest: true,
    },
  },

  // Articles Entry
  {
    path: '/articles/entry/:entryId',
    name: 'articles.entry',
    component: ArticlesEntry,
    meta: {
      guest: true,
    }
  },
  {
    path: '/oa/',
    name: 'oa.index',
    component: OAIndex,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/checkin',
    name: 'oa.export.checkin',
    component: OAExportCheckIn,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/cost',
    name: 'oa.export.cost',
    component: OAExportCost,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/leave',
    name: 'oa.export.leave',
    component: OAExportLeave,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/reimbursement',
    name: 'oa.export.reimbursement',
    component: OAExportReimbursement,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/purchases',
    name: 'oa.export.purchases',
    component: OAExportPurchases,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/business-travels',
    name: 'oa.export.businessTravels',
    component: OAExportBusinessTravels,
    meta: {
      auth: true,
    }
  },
  {
    path: '/oa/export/over-times',
    name: 'oa.export.overTimes',
    component: OAExportOverTimes,
    meta: {
      auth: true,
    }
  },
  {
    path: '/mall/:mallId',
    name: 'mall.index',
    component: mallIndex,
    meta: {
      guest: true,
    },
    children: [
      {
        path: 'articles/new',
        name: 'mall.article.new',
        component: mallArticleNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'articles/edit/:entryId',
        name: 'mall.article.edit',
        component: mallArticleEdit,
        meta: {
          auth: true,
        }
      },
      {
        path: 'articles/entry/:entryId',
        name: 'mall.article.entry',
        component: mallArticleEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'articles',
        name: 'mall.article.list',
        component: mallArticleList,
        meta: {
          guest: true,
        }
      },
      {
        path: 'topic/new',
        name: 'mall.topic.new',
        component: mallTopicNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'topic/edit/:topicId',
        name: 'mall.topic.edit',
        component: mallTopicEdit,
        meta: {
          auth: true,
        }
      },
      {
        path: 'topic',
        name: 'mall.topic.list',
        component: mallTopic,
        meta: {
          guest: true,
        }
      },
      {
        path: 'topic/entry/:topicId',
        name: 'mall.topic.entry',
        component: mallTopicEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'companies',
        name: 'mall.companies.list',
        component: mallCompanies,
        meta: {
          guest: true,
        }
      },
      {
        path: 'recommend',
        name: 'mall.recommend.list',
        component: mallRecommend,
        meta: {
          guest: true,
        }
      },
      {
        path: 'about',
        name: 'mall.about',
        component: mallAbout,
        meta: {
          guest: true,
        }
      }
    ]
  },

  {
    path: '/cham/:chamId',
    name: 'cham.index',
    component: chamIndex,
    meta: {
      guest: true,
    },
    children: [
      {
        path: 'articles/new',
        name: 'cham.article.new',
        component: chamArticleNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'articles/edit/:entryId',
        name: 'cham.article.edit',
        component: chamArticleEdit,
        meta: {
          auth: true,
        }
      },
      {
        path: 'articles/entry/:entryId',
        name: 'cham.article.entry',
        component: chamArticleEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'articles',
        name: 'cham.article.list',
        component: chamArticleList,
        meta: {
          guest: true,
        }
      },
      {
        path: 'apply/new',
        name: 'cham.apply.new',
        component: chamApplyNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'apply/entry/:entryId',
        name: 'cham.apply.entry',
        component: chamApplyEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'apply',
        name: 'cham.apply.list',
        component: chamApplyList,
        meta: {
          auth: true,
        }
      },
      {
        path: 'annual/new',
        name: 'cham.annual.new',
        component: chamAnnualNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'annual/entry/:entryId',
        name: 'cham.annual.entry',
        component: chamAnnualEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'annual/edit/:entryId',
        name: 'cham.annual.edit',
        component: chamAnnualEdit,
        meta: {
          auth: true,
        }
      },
      {
        path: 'annual',
        name: 'cham.annual.list',
        component: chamAnnualList,
        meta: {
          guest: true,
        }
      },
      {
        path: 'notice/new',
        name: 'cham.notice.new',
        component: chamNoticeNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'notice/edit/:entryId',
        name: 'cham.notice.edit',
        component: chamNoticeEdit,
        meta: {
          auth: true,
        }
      },
      {
        path: 'notice/entry/:entryId',
        name: 'cham.notice.entry',
        component: chamNoticeEntry,
        meta: {
          guest: true,
        }
      },
      {
        path: 'notice',
        name: 'cham.notice.list',
        component: chamNoticeList,
        meta: {
          guest: true,
        }
      },
      {
        path: 'suggest',
        name: 'cham.suggest.create',
        component: chamSuggestCreate,
        meta: {
          guest: true,
        }
      },
      {
        path: 'suggest',
        name: 'cham.suggest.list',
        component: chamSuggestList,
        meta: {
          auth: true,
        }
      },
      {
        path: 'badrecord/new',
        name: 'cham.badrecord.new',
        component: chamBadRecordNew,
        meta: {
          auth: true,
        }
      },
      {
        path: 'badrecord',
        name: 'cham.badrecord.list',
        component: chamBadRecord,
        meta: {
          auth: true,
        }
      },
      {
        path: 'badrecord/entry/:recordId',
        name: 'cham.badrecord.entry',
        component: chamBadRecordEntry,
        meta: {
          auth: true,
        }
      },
      {
        path: 'companies',
        name: 'cham.companies.list',
        component: chamCompanies,
        meta: {
          guest: true,
        }
      },
      {
        path: 'recommend',
        name: 'cham.recommend.list',
        component: chamRecommend,
        meta: {
          guest: true,
        }
      },
      {
        path: 'site',
        name: 'cham.site.list',
        component: chamSite,
        meta: {
          guest: true,
        }
      },
      {
        path: 'about',
        name: 'cham.about',
        component: chamAbout,
        meta: {
          guest: true,
        }
      }
    ]
  },

  // Login
  {
    path: '/access/login',
    name: 'login.index',
    component: require('@/pages/access/login/index/index.vue'),

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },

  // Passowrd Reset
  {
    path: '/access/password-reset',
    name: 'password.reset',
    component: passwordReset,

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },

  // Register
  {
    path: '/access/signup',
    name: 'signup.index',
    component: signupIndex,

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/*',
    redirect: '/home',
  },
];

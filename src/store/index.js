/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// Modules
import auth from './modules/auth';
import companyCats from './modules/company/cats';
import contact from './modules/contact';
import myProfile from './modules/my/profile';
import myIdentities from './modules/my/identities';
import myCompanies from './modules/my/companies';
import myFriends from './modules/my/friends';
import myFollowing from './modules/my/following';
import myMall from './modules/my/mall';
import myCham from './modules/my/cham';
import nim from './modules/nim/sessions';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  /**
   * Assign the modules to the store
   */
  modules: {
    auth,
    companyCats,
    contact,
    myProfile,
    myIdentities,
    myCompanies,
    myFriends,
    myFollowing,
    myMall,
    myCham,
    nim,
  },

  /**
   * If strict mode should be enabled
   */
  strict: debug,

  /**
   * Plugins used in the store
   */
  plugins: debug ? [createLogger()] : [],
});

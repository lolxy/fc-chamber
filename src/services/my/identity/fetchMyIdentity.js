import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';
import Cookie from '@/utils/cookie';

import authService from '@/services/auth';
import nimGetIdCard from '@/services/nim/getIdCard';

import fetchMyProfile from '@/services/my/profile/fetchMyProfile';
import fetchMyFriends from '@/services/my/friends/fetchMyFriends';
import fetchMyFriendsGroups from '@/services/my/friends/fetchMyFriendsGroups';

import fetchMyMall from '@/services/my/mall/fetchMyMall';
import fetchMyCham from '@/services/my/cham/fetchMyCham';

// When the request succeeds
const success = (identities) => {
  let cIdentity = identities[0];

  store.dispatch('myIdentities/getMyIdentities', identities);
  store.dispatch('myIdentities/setMyIdentitiesLoaded');

  if (!localStorage.getItem('meId')) {
    localStorage.setItem('meId', identities[0].Id);
    localStorage.setItem('companyId', identities[0].CompanyId);
    Cookie.setCookie('fcIdentity', identities[0].Id);
  } else {
    cIdentity = _.find(identities, identity => identity.Id === localStorage.getItem('meId'));
    Cookie.setCookie('fcIdentity', cIdentity.Id);
  }

  fetchMyProfile(cIdentity.UserId);

  const meId = localStorage.getItem('meId');
  nimGetIdCard(meId, false);

  fetchMyFriendsGroups(meId);
  fetchMyFriends(meId);

  if (cIdentity.Company && cIdentity.Company.Type && cIdentity.Company.Type.Code === 'CompanyTypeMall') {
    fetchMyMall();
  } else if (cIdentity.Company && cIdentity.Company.Type && cIdentity.Company.Type.Code === 'CompanyTypeCommerceChamber') {
    fetchMyCham();
  }
};

// When the request fails
const failed = (error) => {
  if (error.response.status === 401) {
    authService.logout();
  }
};

export default () => {
  Vue.$http.get('/My/Identities', {
    params: {
      fields: 'company,company.type,user,company.hasSites',
    },
  }).then((response) => {
    success(response.data);
  })
  .catch((error) => {
    failed(error);
  });
};

import Vue from 'vue';
import store from '@/store';

// When the request succeeds
const success = (employees) => {
  store.dispatch('myEmployees/getMyEmployees', employees);
  store.dispatch('myEmployees/setMyEmployeesLoaded', employees);
};

// When the request fails
const failed = () => {
};

export default () => {
  let cIndex = 0;
  let companyId;

  if (localStorage.getItem('myIdentityIndex')) {
    cIndex = localStorage.getItem('myIdentityIndex');
  }

  if (store.state.myIdentities.list.length) {
    companyId = store.state.myIdentities.list[cIndex].CompanyId;
  }

  Vue.$http.get('/My/Employees', {
    params: {
      'args.companyId': companyId,
      fields: 'User',
    },
  }).then((response) => {
    success(response.data);
  })
  .catch((error) => {
    failed(error);
  });
};

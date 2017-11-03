import Vue from 'vue';
import store from '@/store';

export default () => {
  Vue.$http.get('/My/EmployeeInvites/Receive', {
    params: {
      fields: 'User',
      'args.take': 30,
    },
  }).then((response) => {
    store.dispatch('myEmployees/getEmployeeReceiveRequests', response.data);
  });

  Vue.$http.get('/My/EmployeeInvites/Send', {
    params: {
      fields: 'User',
      take: 30,
    },
  }).then((response) => {
    store.dispatch('myEmployees/getEmployeeSendRequests', response.data);
  });
};

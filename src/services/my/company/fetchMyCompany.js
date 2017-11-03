import Vue from 'vue';
import _ from 'lodash';
import store from '@/store';

// When the request succeeds
const success = (companies) => {
  let myColleague = [];
  const companyId = localStorage.getItem('companyId');
  const currentCompany = companies.filter(company => company.Id === companyId);

  store.dispatch('myCompanies/getMyCompanies', companies);
  store.dispatch('myCompanies/setMyCompaniesLoaded', companies);

  if (currentCompany.length) {
    myColleague = currentCompany[0].Employees.filter(employee => employee.UserId);

    myColleague = _.map(myColleague, (item) => {
      const employee = {
        Id: item.Id,
        FriendId: item.Id,
        Friend: item,
        GroupId: 'colleague',
      };
      return employee;
    });

    window.myColleagueList = myColleague;
    window.myFriendsList = window.myFriendsList.concat(myColleague);
    store.dispatch('myFriends/setColleaguelistLoaded');
  }
};

// When the request fails
const failed = () => {
};

export default () => {
  Vue.$http.get('/My/Companies', {
    params: {
      fields: 'Employees,Employees.User,Employees.Company',
    },
  }).then((response) => {
    success(response.data);
  })
  .catch((error) => {
    failed(error);
  });
};

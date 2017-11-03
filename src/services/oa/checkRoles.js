import Vue from 'vue';

export default (empid, roles, self) => {
  Vue.$http.get(`../v1/OAInRoles/CheckRoles/?empid=${empid}&roles=${roles}`).then((response) => {
    if (response.data && response.data.code === '1') {
      self.hasRole = true;
    } else {
      self.hasRole = false;
    }
  });
};

import Vue from 'vue';
import getInstance from './getInstance';

export default (meId, isRefresh) => {
  Vue.$http.get(`/Nim/GetIdCard/${meId}?refresh=${isRefresh}`).then((response) => {
    localStorage.setItem('accid', response.data.info.accid);
    getInstance(response.data.info.accid, response.data.info.token);
  });
};

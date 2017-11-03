import Vue from 'vue';

import oaCheckRoles from '@/services/oa/checkRoles';
import exportAside from '@/components/oa/export/aside/main.vue';
import formatMyFriendsList from '@/services/my/friends/formatMyFriendsList';

export default {
  data() {
    return {
      activeNames: null,
      hasRole: false,
      settingDialogVisible: false,
      roleList: {},
      myColleagueList: [],
      myColleagueListCheckAll: true,
      myColleagueListIsIndeterminate: true,
      exportForm: {
        Type: [],
        dateRange: [],
        EmployeeId: [],
        Status: ['0', '1', '2', '3', '-1']
      },
      exportList: [],
      exportStatus: true,
      exportMessage: ''
    }
  },
  computed: {
    meId() {
      return localStorage.getItem('meId');
    },
    companyId() {
      return localStorage.getItem('companyId');
    },
    myColleagueListIds() {
      const ids = [];
      this.myColleagueList.forEach((item) => {
        ids.push(item.Friend.Id);
      })
      return ids;
    },
    myColleagueListLoaded() {
      return this.$store.state.myFriends.colleagueListLoaded;
    }
  },
  components: {
    exportAside,
    VLayout: require('@/layouts/default/default.vue'),
    placeholder: require('@/components/placeholder/item.vue')
  },
  methods: {
    handleColleagueListAllChange(event) {
      this.exportForm.EmployeeId = event.target.checked ? this.myColleagueListIds : [];
      this.myColleagueListIsIndeterminate = false;
      this.onExportSubmit();
    },
    handleColleagueListChange(value) {
      let checkedCount = value.length;
      this.myColleagueListCheckAll = checkedCount === this.myColleagueListIds.length;
      this.myColleagueListIsIndeterminate = checkedCount > 0 && checkedCount < this.myColleagueListIds.length;
      this.onExportSubmit();
    },
    getStatus(code) {
      const cStatus = _.find(this.oaStatus, item => item.value === String(code))
      if (cStatus) {
        return cStatus.label;
      }
    },
    getItemClass(code) {
      const cStatus = _.find(this.oaStatus, item => item.value === String(code))
      if (cStatus.value === '-1') {
        return 'alert-danger';
      }
      if (cStatus.value === '0') {
        return 'alert-warning';
      }
      if (cStatus.value === '1') {
        return 'alert-success';
      }
      if (cStatus.value === '2') {
        return 'alert-info';
      }
      if (cStatus.value === '3') {
        return 'alert-cancel';
      }
    },
    onExportSubmit() {
      const formDatas = {
        StartTime: null,
        EndTime: null,
        EmployeeId: this.exportForm.EmployeeId.join(','),
        CompanyId: this.companyId,
      }

      if (this.exportForm.dateRange.length) {
          formDatas.StartTime = String(new Date(this.exportForm.dateRange[0]).getTime()).slice(0, -3);
          formDatas.EndTime = String(new Date(this.exportForm.dateRange[1]).getTime()).slice(0, -3);
      }

      Vue.$http.get('../v1/SignUps?fields=SignUpImages,SignInEmployees,Employee', {
        params: formDatas
      }).then((response) => {
        this.exportList = response.data;
        this.exportStatus = true;
      }).catch(() => {
        this.exportList = []
        this.exportStatus = false
      })
    },
    downloadExportFile() {
      const formDatas = {
        StartTime: null,
        EndTime: null,
        EmployeeId: this.exportForm.EmployeeId.join(','),
        OperationId: this.meId
      }
      if (this.exportForm.dateRange.length) {
          formDatas.StartTime = new Date(this.exportForm.dateRange[0]).toISOString();
          formDatas.EndTime = new Date(this.exportForm.dateRange[1]).toISOString();
      } else {
        formDatas.StartTime = new Date('2016-01-01T00:00:00.000Z').toISOString();
        formDatas.EndTime = new Date().toISOString();
      }

      const urlParameters = Object.keys(formDatas).map((i) => i+'='+formDatas[i]).join('&');

      window.location.href = `${process.env.apiRoot}/../v1/ExportExcels/ToSignUpExcel?${urlParameters}`;
    },
    openSettingDialog() {
      this.myColleagueList.forEach((item) => {
        Vue.set(this.roleList, `role-${item.Friend.Id}`, item.Friend.Id === this.meId);
        this.checkRoles(item.Friend.Id);
      })
      this.settingDialogVisible = true;
    },
    checkRoles(empid) {
      Vue.$http.get(`../v1/OAInRoles/${empid}`).then((response) => {
        const roles = response.data.ObjRoles.filter(item => item === 'signup');
        if (roles.length) {
          this.roleList[`role-${empid}`] = true;
        } else {
          this.roleList[`role-${empid}`] = false;
        }
      });
    },
    onRoleChange(empid) {
      if (this.roleList[`role-${empid}`]) {
        Vue.$http.post('../v1/OAInRoles/Add', {
          EmployeeId: empid,
          OARoles: 'signup'
        })
      } else {
        Vue.$http.post('../v1/OAInRoles/Remove', {
          EmployeeId: empid,
          OARoles: 'signup'
        }).then(() => {
          this.hasRole = false
        })
      }
    }
  },
  mounted() {
    oaCheckRoles(this.meId, 'signup', this);
    this.myColleagueList = window.myColleagueList;
  },
  watch: {
    myColleagueListLoaded() {
      this.myColleagueList = window.myColleagueList;
    }
  }
};

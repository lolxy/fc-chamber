/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */

import Vue from 'vue';
import store from '@/store';
const employeeBatchAdd = r => require.ensure([], () => r(require('@/components/company/employeeBatchAdd/item.vue')), 'employee-batch-add');
const employeeAdd = r => require.ensure([], () => r(require('@/components/company/employeeAdd/item.vue')), 'employee-add');

export default {
  data() {
    return {
      formLabelWidth: '120px',
      companyId: window.localStorage.getItem('companyId'),
      allEmployees: [],
      employeeForm: {
        id: null,
        name: null,
        userId: null,
        jobTitle: null,
        isPublished: false
      },
      employeeDialogTitle: null,
      employeeBatchDialogTitle:'批量导入员工',
      employeeDialogFormVisible: false,
      cancelConnectionDialogVisible: false,
      employeeBatchDialogVisible:false,
      currentCancelConnectionUser: {},
      currentEditingUser: {},
      currentGroupId: 1,
      currentRelUser: {},
      currRelUserErrorMsg: null,
      findUserKeyword: null,
      findUserResult: [],
      findUserLoading: false,
      allEmployeeRoles:[],
      allRoleList:{},
      isRole:false,
      groups: [
        {
          id: 1,
          name: '已绑定的职员',
        },
        {
          id: 2,
          name: '未绑定的职员',
        }
      ],
    }
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
    employeeBatchAdd: employeeBatchAdd,
    employeeAdd: employeeAdd
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    userId() {
      return localStorage.getItem('userId');
    },
    isManager() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myManager = this.$store.state.myCompanies.list.filter((item) => {
        return item.Id === currentCompanyId;
      });
      if (myManager.length) {
        return true;
      }
      return false;
    },
    isMyCompany() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myCompanies.list.filter((item) => {
        return item.OwnerId === userId && item.Id === currentCompanyId;
      });
      if(myCompany.length){
        return true;
      }
      return false;
    },
    formatAllEmployeeRoles(){
      if(this.allEmployeeRoles.length){
        this.allEmployeeRoles.forEach((item)=>{
          Vue.set(this.allRoleList,`${item.Code}`,_.map(item.Employees,(item)=>{
            return {
              'UserId':item.UserId
            }
          }));
        });
      }
      return this.allRoleList;
    },
    employees() {
      if (this.currentGroupId === 1) {
        return this.allEmployees.filter(employee => employee.UserId);
      }
      return this.allEmployees.filter(employee => !employee.UserId);
    },
  },
  mounted() {
    this.initEmployees();
    this.isRole=!this.isManager;
    if (this.$store.state.route.params.id) {
      this.fetchRoles();
    }
  },
  watch:{
    isManager(val,oVal) {
      this.isRole=!this.isManager;
    },
    companyId() {
      if (this.$store.state.route.params.id) {
        this.fetchRoles();
      }
    }
  },
  methods: {
    fetchRoles() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/My/EmployeeRoles',{
        params: {
          meId:meId,
          fields: 'Employees.Roles'
        },
      }).then((response) => {
        this.allEmployeeRoles = response.data;
      });
    },
    getRoles(roles){
      if(this.formatAllEmployeeRoles && this.formatAllEmployeeRoles[roles]){
        const myRoles = this.formatAllEmployeeRoles[roles].filter((item) => {
          return item.UserId === this.userId;
        });
        if (myRoles.length) {
          return true;
        }
      }
      return false;
    },
    initEmployees() {
      this.allEmployees = [];
      this.fetchEmployees(0);
    },
    fetchEmployees(skips) {
      Vue.$http.get('/My/Employees', {
        params: {
          'companyId': this.companyId,
          fields: 'User',
          take: 150,
          skip: skips,
        },
      }).then((response) => {
        if (response.data.length === 150) {
          this.fetchEmployees(skips + 150);
        }
        this.allEmployees = this.allEmployees.concat(response.data);
      });
    },
    findUser(query) {
      if (query !== '') {
        this.findUserLoading = true;
        Vue.$http.get(`/Account?Keyword=${query}`).then((response) => {
          this.findUserLoading = false;
          this.findUserResult = response.data;
        });
      } else {
        this.findUserResult = [];
      }
    },
    currentRelUserChange(userId) {
      this.currRelUserErrorMsg = null;
      this.employeeForm.userId = userId;
    },
    openCancelConnectionDialog(employee) {
      this.cancelConnectionDialogVisible = true;
      this.currentCancelConnectionUser = employee;
    },
    closeCancelConnectionDialog() {
      this.cancelConnectionDialogVisible = false;
      this.currentCancelConnectionUser = {};
    },
    confirmCancelConnectionDialog() {
      if (this.currentCancelConnectionUser.Id) {
        Vue.$http.post('/Employees', {
          Id: this.currentCancelConnectionUser.Id,
          UserId: null,
        }).then(() => {
          this.fetchEmployees();
          this.$notify({
            title: '更新成功',
            message: `成功将职员${this.currentCancelConnectionUser.Name}与用户${this.currentCancelConnectionUser.User.RealName}取消关联!`,
            type: 'success',
            offset: 50
          });
          this.closeCancelConnectionDialog();
        });
      }
    },
    switchGroup(groupId) {
      this.currentGroupId = groupId;
    },
    openEditEmployeeDialog(user) {
      this.employeeDialogTitle = '编辑职员信息';
      this.currentEditingUser = user;
      this.employeeDialogFormVisible = true;
    },
    openNewEmployeeDialog() {
      this.employeeDialogTitle = '新增职员';
      this.currentEditingUser = {};
      this.employeeDialogFormVisible = true;
    },
    openBatchEmployeeDialog() {
      this.employeeBatchDialogVisible = true;
    },
    closeEmployeeDialog() {
      this.employeeDialogFormVisible = false;
      this.allEmployees = [];
      this.fetchEmployees(0);
    },
    updateEmployeeProfile(hasUser) {
      const companyId = localStorage.getItem('companyId');
      let options = {
        Id: this.employeeForm.id,
        CompanyId: companyId,
        Name: this.employeeForm.name,
        JobTitle: this.employeeForm.jobTitle,
        IsShowInCompanySite: this.employeeForm.isPublished,
      };

      if (!hasUser) {
        options['UserId'] = this.employeeForm.userId;
      }

      Vue.$http.post('/Employees?fields=User', options).then((response) => {

        this.currentEditingUser.Name = response.data.Name;
        this.currentEditingUser.JobTitle = response.data.JobTitle;
        this.currentEditingUser.IsShowInCompanySite = response.data.IsShowInCompanySite;

        this.employeeDialogFormVisible = false;

        this.allEmployees = this.allEmployees.filter(item => item.Id !== this.employeeForm.id).concat(response.data);

        this.$notify({
          title: '更新成功',
          message: `职员${this.currentEditingUser.Name}信息已更新!`,
          type: 'success',
          offset: 50
        });

      }).catch((error) => {
        this.currRelUserErrorMsg = '此用户已绑定了其它职员身份';
      });
    },
    deleteThisEmployee(user) {
      this.$confirm('此操作将永久删除该职员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$http.delete(`/Employees/${user.Id}`)
        .then((response) => {
          this.allEmployees = this.allEmployees.filter(item => item.Id !== user.Id);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
};

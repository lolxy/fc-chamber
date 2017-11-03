/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */

import Vue from 'vue';
import _ from 'lodash';
import store from '@/store';
const employeeRoleList = r => require.ensure([], () => r(require('@/components/company/employeeRoleList/item.vue')), 'employee-role-list');

export default {
  data() {
    return {
      formLabelWidth: '120px',
      companyId: window.localStorage.getItem('companyId'),
      allEmployees: [],
      allEmployeeRoles:[],
      checkedList: {},
      initCheckedList:{},
      labelCss:["label-info","label-primary","label-success"],
      hasRoleList:false,
      managerDialogVisible: false,
      currentRolesCode:null,
      currentRolesName:null,
      currentSelectedEmployees:[],
      isRole:false
    }
  },
  components: {
    placeholder: require('@/components/placeholder/item.vue'),
    employeeRoleList: employeeRoleList
  },
  watch:{
    allEmployeeRoles(){
      this.hasRoleList=true;
    },
    isMyCompany(){
      this.isRole=!this.isMyCompany;
    }
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    newMemberIds() {
      return _.map(this.checkedList, 'Id');
    },
    initMemberIds(){
      return _.map(this.currentSelectedEmployees, 'Id');
    },
    meId() {
      return localStorage.getItem('meId');
    },
    userId() {
      return localStorage.getItem('userId');
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
    }
  },
  mounted() {
    this.fetchRoles();
    this.fetchEmployees(0);
    this.isRole=!this.isMyCompany;
  },
  methods: {
    initCheckLists() {
      this.currentSelectedEmployees.forEach((item)=>{
        Vue.set(this.initCheckedList, `${item.Id}`, item);
      });
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
    fetchRoles() {
      Vue.$http.get('/My/EmployeeRoles',{
        params: {
          meId:this.meId,
          fields: 'Employees.Roles'
        },
      }).then((response) => {
        this.allEmployeeRoles = response.data;
      });
    },
    updateCheckedList(data) {
      this.checkedList = data;
    },
    setManager(rolesName,rolesCode,employees){
      this.managerDialogVisible=true;
      this.currentRolesCode = rolesCode;
      this.currentRolesName = `[${rolesName}]角色设置`;
      this.initCheckedList = {};
      this.currentSelectedEmployees = [];
      this.currentSelectedEmployees = employees;
      this.initCheckLists();
    },
    addRoleFromMember() {
      const oldmemberData = {
        Roles: [`${this.currentRolesCode}`],
        Ids: this.initMemberIds
      };
      this.removeCompanyRole(oldmemberData);
    },
    removeCompanyRole(oldMember) {
      Vue.$http.post(`Employees/RemoveRoles`, oldMember).then((response) => {
        if(this.newMemberIds.length){
            const newmemberData = {
              Roles: [`${this.currentRolesCode}`],
              Ids: this.newMemberIds
            }
            this.addCompanyRole(newmemberData);
        }else{
          this.$notify({
            title: '操作成功',
            message: '您成功更新管理员！',
            type: 'success'
          });
          this.fetchRoles();
        }
        this.managerDialogVisible=false;
      }).catch((error)=>{
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'error'
        })
      });
    },
    addCompanyRole(newMember) {
      Vue.$http.post(`Employees/AddRoles`, newMember).then((response) => {
        this.$notify({
          title: '操作成功',
          message: '您成功更新管理员！',
          type: 'success'
        });
        this.fetchRoles();
      }).catch((error)=>{
        this.$notify({
          title: '操作失败',
          message: error.response.data.Message,
          type: 'error'
        })
      });
    },
  },
};

/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';

export default {
  data() {
    return {
      checkedList: {},
      companydepartments:[],
      departmentName:[]
    }
  },
  props: [
    'items',
    'initCheckedList'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    },
    companyId() {
      return this.$store.state.route.params.id
    },
    checkedListKeys() {
      return Object.keys(this.checkedList);
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    this.fetchCompanydepartments();
    this.checkedList = this.initCheckedList;
  },
  watch:{
    initCheckedList(){
      this.checkedList = this.initCheckedList;
    }
  },
  methods: {
    fetchCompanydepartments() {
      Vue.$http.get('/Companydepartments/CompanyDepartment/List',{
        params:{
          MeId:this.meId,
          CompanyId:this.companyId,
          DepartmentTree:true
        }
      }).then((response) => {
         this.companydepartments = response.data
      });
    },
    getDepartmentName(DepartmentId) {
      const currDepartment = _.find(this.companydepartments, item => item.Id === DepartmentId)
      if (currDepartment) {
        return currDepartment.Name
      }
      return '无部门'
    },

    hasChecked(cItem) {
      if (this.checkedList[cItem.Id]) {
        return true;
      }
      return false;
    },

    toggleToCheckedList(cItem) {
      if (!this.checkedList[cItem.Id]) {
        if(this.checkedListKeys.length<3){
          Vue.set(this.checkedList, `${cItem.Id}`, cItem);
        }else{
          this.$message({
            message: '您最多只能设置3个管理员！',
            type: 'success'
          });
        }
      } else {
        Vue.delete(this.checkedList, `${cItem.Id}`);
      }
      this.$emit('updateCheckedList', this.checkedList);
    }
  }
};

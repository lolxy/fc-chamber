/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue'

export default {
  data() {
    return {
      form: {
        Name: null,
        JobTitle: null,
        PhoneNumber: null,
        CompanyDepartmentId:null,
        userId:null,
        isShowInCompanySite:"true"
      },
      departmentsForm:{
        Name:null,
        Notes:null,
        CompanyId:null,
      },
      massage:false,
      success:false,
      departmentsDialogVisible:false,
      info:'',
      companydepartments:[],
      formRules: {
        Name:[
          { required: true, message: '员工姓名必填', trigger: 'blur' }
        ],
        PhoneNumber:[
          { required: true, message: '员工手机号码必填', trigger: 'blur' },
          {pattern: /^1(3|4|5|7|8)\d{9}$/,message: '手机号码格式不正确', trigger: 'blur' }
        ],
        JobTitle: [
          { required: true, message: '岗位名称必填', trigger: 'blur' },
          { max: 16, message: '长度需要小于 16 个字符', trigger: 'blur' }
        ],
        CompanyDepartmentId:[
          { required: true, message: '部门必选', trigger: 'blur' }
        ]
      },
      departmentsFormRules:{
        Name:[
          { required: true, message: '部门名称必填', trigger: 'blur' }
        ]
      }
    }
  },
  props:[
    "items"
  ],
  computed: {
    route() {
      return this.$store.state.route
    },
    me() {
      const cIndex = this.$store.state.myIdentities.cIndex
      const cIdentity = this.$store.state.myIdentities.list[cIndex]
      return cIdentity
    },
    meId() {
      return localStorage.getItem("meId");
    },
    companyId() {
      return this.$store.state.route.params.id
    },
    formatedCompanydepartments() {
      const departments = [{
        "Id": "00000000-0000-0000-0000-000000000000",
        "Ordering": 0,
        "Name": "未分组"
      }]

      return departments.concat(this.companydepartments)
    }
  },
  mounted() {
    this.fetchCompanydepartments();
    this.init();
  },
  methods: {
    init() {
      if(this.items.Id){
        this.form.Id=this.items.Id;
        this.form.Name=this.items.Name;
        this.form.JobTitle=this.items.JobTitle;
        this.form.PhoneNumber=this.items.PhoneNumber;
        this.form.CompanyDepartmentId=this.items.CompanyDepartmentId;
        this.form.userId=this.items.userId;
        this.form.isShowInCompanySite=`${this.items.IsShowInCompanySite}`;
      }else{
        this.form.Id="";
        this.form.Name="";
        this.form.JobTitle="";
        this.form.PhoneNumber="";
        this.form.CompanyDepartmentId="";
        this.form.userId="";
        this.form.isShowInCompanySite = "true";
      }
    },
    closeMassage() {
      this.massage=false
    },
    fetchCompanydepartments() {
      Vue.$http.get('/Companydepartments/CompanyDepartment/List',{
        params:{
          MeId:this.me,
          CompanyId:this.companyId,
          DepartmentTree:true
        }
      }).then((response) => {
         this.companydepartments = response.data
      });
    },
    newAddDepartments() {
      this.departmentsDialogVisible=!this.departmentsDialogVisible
    },
    submitDepartmentsForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            Vue.$http.post('Companydepartments/CompanyDepartmentCategory', {
              Name: this.departmentsForm.Name,
              Notes: this.departmentsForm.Notes,
              CompanyId: this.companyId,
              MeId: this.meId
            }).then((response) => {
              this.$notify({
                title: '添加成功',
                message: `成功新增部门：${this.departmentsForm.Name}`,
                type: 'success',
                offset: 100
              });
              this.departmentsDialogVisible=false;
              this.fetchCompanydepartments()
            }).catch((error) => {
              this.$notify({
                title: '添加失败',
                message: `添加部门：${this.departmentsForm.Name}失败！失败原因：${error.response.data.Message}`,
                type: 'error',
                offset: 100
              });
            })
        } else {
          return false;
        }
      })
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Vue.$http.get('Account', {
              params:{
                Keyword:this.form.PhoneNumber
              }
            }).then((response) => {
              if(response.data.length){
                this.form.userId=response.data[0].Id;
              }else{
                this.form.userId="";
              }
              Vue.$http.post('Employees', {
                Id:this.form.Id,
                Name: this.form.Name,
                JobTitle: this.form.JobTitle,
                PhoneNumber: this.form.PhoneNumber,
                CompanyDepartmentId:this.form.CompanyDepartmentId,
                CompanyId: this.companyId,
                UserId:this.form.userId,
                IsShowInCompanySite:this.form.isShowInCompanySite
              }).then((response) => {
                this.massage=true;
                this.success=true;
                if(this.form.Id){
                  this.info=`更新 ${this.form.Name} 信息成功！`
                }else{
                  this.info=`邀请 ${this.form.Name} 成功，等待员工确认！`
                }
              }).catch((error) => {
                this.massage=true,
                this.success=false,
                this.info=error.response.data.Message
              })
            })
          } else {
            return false;
          }
        })
      }
  }
}

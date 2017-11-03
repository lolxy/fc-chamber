/* ============
 * Profile Grid
 * ============
 *
 */
import Vue from 'vue';
import districts from '@/services/districts'

export default {
  data() {
    return {
      checkedList: {},
      enterpriseTypeList:[],
      isShowAlert:false,
      showCreateCompany:false,
      selectedCompanyId:'',
      companyList:[],
      newCreateCompanyName:'',
      companyKeyword:'',
      uploadLogoImageData:{},
      companyLogo:'',
      bucketHost: `${process.env.qiniuBucketHost}`,
      virtualForm: {
        name: '',
        phone: '',
        identity:null,
        commerceChamberId:null,
        companyId:null,
        typeId:null,
        childTypeId:null
      },
      companyForm: {
        category:'',
        Name: '',
        BrandName: '',
        LegalPersonName:'',
        ServiceTel:'',
        AboutUs:'',
        Address:'',
        industryTypes: [],
        industryProps: '',
        industryCategories: [],
        residents: [],
        IsShowFullDetails: false
      },
      options: districts,
      rules:{
        name:[
          { required: true, message: '成员名称不能为空', trigger: 'blur' }
        ],
        phone:[
          // { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[34578]\d{9})/, message: '联系电话格式错误', trigger: 'blur' }
        ],
        typeId:[
          {required: true, type: 'number', message: '商会企业类型不能为空',trigger:'change'}
        ],
        childTypeId: [
          { required: true, type: 'number', message: '商会成员类型不能为空',trigger:'change'}
        ]
      },
      companyrules: {
        Name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { max: 128, message: '最大长度 128 个字符', trigger: 'blur' }
        ],
        ServiceTel:[
          // { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[34578]\d{9})/, message: '联系电话格式错误', trigger: 'blur' }
        ],
        BrandName: [
          { required: true, message: '请输入公司简称', trigger: 'blur' },
          { max: 64, message: '最大长度 64 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择企业相关类型', trigger: 'change' }
        ]
      }
    }
  },
  props: [
    'isVirtual',
    'searchResultTitle'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue')
  },
  computed: {
    userId() {
      return localStorage.getItem('userId');
    },
    categories() {
      return this.$store.state.companyCats.companyCats
    },
    industryTypes() {
      return this.$store.state.companyCats.industryTypes
    },
    industryCategories() {
      return this.$store.state.companyCats.industryCats
    },
    industryProps() {
      return this.$store.state.companyCats.industryProps
    },
    selectedCompany() {
      const company = _.find(this.companyList, item => item.Id === this.selectedCompanyId)
      if (company) {
        return company
      }
      return {}
    }
  },
  mounted() {
    this.isShowAlert=true;
    this.fetchEnterpriseType();
  },
  watch:{
    isShowAlert() {
      if(this.isShowAlert){
        setInterval(()=>{
          this.closeAlert()
        },7000);
      }
    }
  },
  methods: {
    formateEnterpriseType(typeId){
      const enterpriseType = _.find(this.enterpriseTypeList, item => item.typeId === typeId)
      if (enterpriseType) {
        return enterpriseType.child;
      }
      return [];
    },
    resetCompanyForm() {
      this.companyForm.category='',
      this.companyForm.Name='',
      this.companyForm.BrandName='',
      this.companyForm.LegalPersonName='',
      this.companyForm.ServiceTel='',
      this.companyForm.AboutUs='',
      this.companyForm.Address='',
      this.companyForm.residents=[],
      this.companyForm.industryTypes=[],
      this.companyForm.industryProps='',
      this.companyForm.industryCategories=[],
      this.companyForm.IsShowFullDetails=false
    },
    resetVirtualForm() {
      this.virtualForm.name='',
      this.virtualForm.phone='',
      this.virtualForm.companyId=null,
      this.virtualForm.typeId=null,
      this.virtualForm.childTypeId=null
    },
    resetSearch() {
      this.companyList = [],
      this.companyKeyword = '',
      this.selectedCompanyId = null,
      this.companyLogo = '',
      this.resetVirtualForm()
    },
    createNewCompany() {
      this.showCreateCompany = true,
      this.resetCompanyForm(),
      this.companyForm.Name = ''
    },
    initSelectType() {
      this.virtualForm.childTypeId=null;
    },

    beforeLogoUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        const upToken = response.data.Token;
        this.uploadLogoImageData = {
          key,
          token: upToken,
        };
      });
    },

    handleLogoUploadSuccess(response) {
      const key = response.key;
      const url = `${this.bucketHost}/${encodeURI(key)}`;
      const meId = localStorage.getItem('meId');
      const chamId = localStorage.getItem('chamId');
      Vue.$http.post(`${process.env.apiCham}/commerceChamber/updateCompanyLogo`, {
        commerceChamberId:chamId,
        companyId:this.selectedCompanyId,
        companyLogo:url,
        identity:meId
      }).then((response)=>{
        this.companyLogo = url;
      }).catch((error)=>{
        this.$notify({
          title: '操作出错',
          message: error.response.data.Message,
          type: 'error'
        });
      });
    },

    submitVirtualMemberForm(formName) {
      const meId = localStorage.getItem('meId');
      const chamId = localStorage.getItem('chamId');
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Vue.$http.post(`${process.env.apiCham}/commerceChamber/addVirtualMember`, {
            commerceChamberId: chamId,
            companyId: this.selectedCompanyId,
            identity: meId,
            name:this.virtualForm.name,
            phone:this.virtualForm.phone,
            typeId:this.virtualForm.typeId,
            childTypeId:this.virtualForm.childTypeId,
            companyLogo:this.companyLogo
          }).then((response) => {
            this.$emit('managerUpdate');
            this.resetSearch();
            this.$notify({
              title: '操作成功',
              message: '您成功添加成员到商会！',
              type: 'success'
            })
          }).catch((error)=>{
            this.$notify({
              title: '操作失败',
              message: error.response.data.Message,
              type: 'error'
            })
          });
        } else {
          return false;
        }
      });
    },
    submitCompanyForm(formName) {
      const categoryIds = [this.companyForm.category]
        .concat(this.companyForm.industryTypes)
        .concat(this.companyForm.industryProps)
        .concat(this.companyForm.industryCategories)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          Vue.$http.post('/Companies/RegisterVirtual', {
              Name: this.companyForm.Name,
              BrandName: this.companyForm.BrandName,
              ResidentProvince: this.companyForm.residents[0],
              ResidentCity: this.companyForm.residents[1],
              ResidentArea: this.companyForm.residents[2],
              LegalPersonName:this.companyForm.LegalPersonName,
              ServiceTel:this.companyForm.ServiceTel,
              AboutUs:this.companyForm.AboutUs,
              Address:this.companyForm.Address,
              IsShowFullDetails:this.companyForm.IsShowFullDetails,
              CategoryIds: categoryIds
          })
          .then((response) => {
            this.selectedCompanyId = response.data.Id;
            this.newCreateCompanyName = response.data.BrandName;
            this.showCreateCompany = false;
            this.$notify({
              title: '操作成功',
              message: `新增公司${this.companyForm.BrandName}成功！`,
              type: 'success'
            });
          }).catch((error)=>{
            this.$notify({
              title: '操作失败',
              message: error.response.data.Message,
              type: 'error'
            })
          });
        } else {
          return false;
        }
      });
    },
    searchCompany() {
      this.fetchCompanyList();
      if(!this.companyList.length){
        this.resetCompanyForm();
        this.companyForm.Name = this.companyKeyword;
      }
    },
    fetchCompanyList() {
      Vue.$http.get('/Companies/KeywordGet', {
        params: {
          keyword: this.companyKeyword,
          skip: this.currentPageSize * (this.currentPage - 1),
          take: this.currentPageSize
        }
      })
      .then((response) => {
        this.companyList = response.data;
        this.showCreateCompany = response.data.length?false:true;
        this.selectedCompanyId = null;
      });
    },
    closeAlert() {
      this.isShowAlert = false;
    },
    fetchEnterpriseType() {
        Vue.$http.get(`${process.env.apiCham}/enterpriseType/lists`,{
          params:{
            withChild:1
          }
        }).then((response) => {
            this.enterpriseTypeList = response.data;
        })
    }
  }
};

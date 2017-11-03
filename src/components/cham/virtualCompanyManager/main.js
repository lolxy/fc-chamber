import Vue from 'vue';
import districts from '@/services/districts'
import _ from 'lodash'

export default {
  components: {
    memberSearchList: require('@/components/cham/memberSearchList/item.vue')
  },
  data() {
    return {
      companyForm: {
        category:'',
        Name: '',
        BrandName: '',
        LegalPersonName:'',
        ServiceTel:'',
        ServiceTelImgEncodedData:'',
        AboutUs:'',
        Address:'',
        industryTypes: [],
        industryProps: '',
        industryCategories: [],
        residents: [],
        IsShowFullDetails: false
      },
      currentArea:'',
      options: districts,
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
  props: ['currentCompanyId'],
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId(){
      return localStorage.getItem('meId');
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    },
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
    }
  },
  mounted() {
    this.fetchCompanyInfo();
  },
  watch:{
    currentCompanyId() {
      this.companyForm.residents=[];
      this.fetchCompanyInfo();
    }
  },
  methods: {
    fetchCompanyInfo(){
      Vue.$http.get(`/Companies/${this.currentCompanyId}`,{
        params:{
          fields:'Categories'
        }
      }).then((response) => {
        this.companyForm.Name=response.data.Name;
        this.companyForm.BrandName=response.data.BrandName;
        this.companyForm.LegalPersonName=response.data.LegalPersonName;
        this.companyForm.residents[0]=response.data.ResidentProvince;
        this.companyForm.residents[1]=response.data.ResidentCity;
        this.companyForm.residents[2]=response.data.ResidentArea;
        this.currentArea = `${response.data.ResidentProvince}/${response.data.ResidentCity}/${response.data.ResidentArea}`;
        this.companyForm.AboutUs=response.data.AboutUs;
        this.companyForm.Address=response.data.Address;
        this.companyForm.ServiceTelImgEncodedData=response.data.ServiceTelImgEncodedData;
        this.companyForm.IsShowFullDetails=response.data.IsShowFullDetails;
        const categories = response.data.Categories;
        const category = categories.filter((item)=>item.TypeId === '07154e16-de57-e611-b281-a00b61b73b60');
        const industryTypes = categories.filter((item)=>item.TypeId === 'b0d53699-dde9-e611-80e3-850a1737545e');
        const industryProps = categories.filter((item)=>item.TypeId === '6e3cecaf-4d35-e711-80e4-da42ba972ebd');
        const industryCategories = categories.filter((item)=>item.TypeId === '4d2d281e-de57-e611-b281-a00b61b73b60');
        if(category.length){
          this.companyForm.category = category[0].Id;
        }
        if(industryProps.length){
          this.companyForm.industryProps = industryProps[0].Id;
        }
        if(industryTypes.length){
          this.companyForm.industryTypes = _.map(industryTypes,'Id');
        }
        if(industryCategories.length){
          this.companyForm.industryCategories = _.map(industryCategories,'Id');
        }
      })
    },
    changeCompanyForm(formName) {
      const categoryIds = [this.companyForm.category]
        .concat(this.companyForm.industryTypes)
        .concat(this.companyForm.industryProps)
        .concat(this.companyForm.industryCategories)

      this.$refs[formName].validate((valid) => {
        const postData = {
          Id:this.currentCompanyId,
          Name: this.companyForm.Name,
          BrandName: this.companyForm.BrandName,
          ResidentProvince: this.companyForm.residents[0],
          ResidentCity: this.companyForm.residents[1],
          ResidentArea: this.companyForm.residents[2],
          LegalPersonName:this.companyForm.LegalPersonName,
          // ServiceTel:this.companyForm.ServiceTel,
          AboutUs:this.companyForm.AboutUs,
          Address:this.companyForm.Address,
          IsShowFullDetails:this.companyForm.IsShowFullDetails,
          CategoryIds: categoryIds
        };
        if(!this.companyForm.ServiceTelImgEncodedData){
          Vue.set(postData,'ServiceTel',this.companyForm.ServiceTel);
        };
        if (valid) {
          Vue.$http.post('/Companies',postData)
          .then((response) => {
            this.selectedCompanyId = response.data.Id;
            this.newCreateCompanyName = response.data.BrandName;
            this.showCreateCompany = false;
            this.$notify({
              title: '操作成功',
              message: `更新公司${this.companyForm.BrandName}成功！`,
              type: 'success'
            });
            this.$emit('managerUpdate');
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
    }
  }
};

import Vue from 'vue';
import store from '@/store';
import pako from 'pako';
import infiniteLoading from 'vue-infinite-loading';

import districts from '@/services/districts';

require('select2/dist/css/select2.css');
require('@/assets/css/select2-bootstrap.css');
require('X-editable/dist/bootstrap3-editable/css/bootstrap-editable.css');

require('select2/dist/js/select2.js');
require('X-editable/dist/bootstrap3-editable/js/bootstrap-editable.js');

$.fn.editable.defaults.mode = 'inline';
$.fn.editable.defaults.emptytext = '未填写';

$.fn.editabletypes.abstractinput.defaults.tpl = '<select multiple></select>';

export default {
  data() {
    return {
      company: {},
      uploadLogoImageData: {},
      uploadVisualizationImageData: {},
      bucketHost: `${process.env.qiniuBucketHost}`,
      modifiedLogoUrl: null,
      modifiedVisualizationImgUrl: null,
      modifiedDistricts: null,
      allDistricts: districts,
      districtFieldVisible: false,
      industryTypeFieldVisible: false,
      industryCatFieldVisible: false,
      currentIndustryCatIds: [],
      currentIndustryTypeIds: [],
      loginDialogVisible: false,
      addFriendDialogVisible: false,
      employees: [],
      allEmployeeRoles:[],
      allRoleList:{}
    }
  },
  components: {
    Avatar: require('@/components/avatar/avatar.vue'),
    profileCover: require('@/components/company/profileCover/item.vue'),
    employeeListGroup: require('@/components/company/employeeListGroup/item.vue'),
    loginDialogForm: require('@/components/access/loginDialogForm/item.vue'),
  },
  computed: {
    auth() {
      return this.$store.state.auth.authenticated;
    },
    userId() {
      return localStorage.getItem('userId');
    },
    companyId() {
      return this.$store.state.route.params.id;
    },
    companyCats() {
      return this.$store.state.companyCats.companyCats;
    },
    industryCats() {
      return this.$store.state.companyCats.industryCats;
    },
    industryTypes() {
      return this.$store.state.companyCats.industryTypes;
    },
    getCategory() {
      return _.filter(this.company.Categories, item => item.TypeId == '07154e16-de57-e611-b281-a00b61b73b60');
    },
    getIndustry() {
      return _.filter(this.company.Categories, item => item.TypeId == '4d2d281e-de57-e611-b281-a00b61b73b60');
    },
    getIndustryIds() {
      let ids = [];
      _.forEach(this.getIndustry, (item) => {
        ids.push(item.Id);
      });
      this.currentIndustryCatIds = ids;
      return ids;
    },
    getIndustryType() {
      return _.filter(this.company.Categories, item => item.TypeId == 'b0d53699-dde9-e611-80e3-850a1737545e');
    },
    getIndustryTypeIds() {
      let ids = [];
      _.forEach(this.getIndustryType, (item) => {
        ids.push(item.Id);
      });
      this.currentIndustryTypeIds = ids;
      return ids;
    },
    getOldMainBusiness() {
      return _.filter(this.company.Categories, item => item.TypeId == 'd167e625-de57-e611-b281-a00b61b73b60');
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
    districts: {
      get: function() {
        return this.modifiedDistricts ||
          [this.company.ResidentProvince, this.company.ResidentCity, this.company.ResidentArea];
      },
      set: function(newVal) {
        this.modifiedDistricts = newVal;
      }
    },
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
    addFriend(companyId) {
      if (this.$store.state.auth.authenticated) {
        this.addFriendDialogVisible = true;
      } else {
        this.loginDialogVisible = true;
      }
    },
    fetchCompanyById(id) {
      const meId = localStorage.getItem('meId');
      let companyUrl = `/Companies/${id}`;
      if (meId) {
        companyUrl = `/Companies/${id}?meId=${meId}`;
      }
      Vue.$http.get(companyUrl, {
        params: {
          fields: 'Categories'
        }
      })
      .then((response) => {
        this.company = response.data;
      });
    },
    fetchEmployeesByCompany(id) {
      let meId = null;
      const companyId = localStorage.getItem('companyId');
      if (this.auth) {
        meId = localStorage.getItem('meId');

        if (this.$store.state.route.params.id === companyId) {
          meId = null;
        }
      }

      Vue.$http.get('/Employees', {
        params: {
          meId: meId,
          CompanyId: id,
          IsShowInCompanySite: true,
          fields: 'User,Company,RelationshipOfUs',
        },
      }).then((response) => {
        this.employees = this.employees.concat(response.data);
      });
    },
    otherCatIds(excludeId) {
      let catIds = [];
      const cats = this.company.Categories.filter((item) => {
        return item.TypeId !== excludeId;
      });

      _.forEach(cats, function(item) {
        catIds.push(item.Id);
      });

      return catIds;
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
      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      this.modifiedLogoUrl = url;

      Vue.$http.post('Companies', {
        Id: companyId,
        LogoUrl: url
      });
    },
    beforeVisualizationUpload(file) {
      const curr = Date.now();
      const prefix = file.lastModified.toString();
      const suffix = file.name;
      const key = encodeURI(`${curr}/${prefix}_${suffix}`);
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        const upToken = response.data.Token;
        this.uploadVisualizationImageData = {
          key,
          token: upToken,
        };
      });
    },
    handleVisualizationUploadSuccess(response, file, _fileList) {
      const key = response.key;
      const url = `${this.bucketHost}/${encodeURI(key)}`;
      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      this.modifiedVisualizationImgUrl = url;

      Vue.$http.post('Companies', {
        Id: companyId,
        VisualizationImgUrl: url
      });
    },
    toggleIndustryTypeFieldVisible() {
      this.industryTypeFieldVisible = !this.industryTypeFieldVisible;
    },
    toggleIndustryCatFieldVisible() {
      this.industryCatFieldVisible = !this.industryCatFieldVisible;
    },
    toggleDistrictFieldVisible() {
      this.districtFieldVisible = !this.districtFieldVisible;
    },
    updateDistricts() {
      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      Vue.$http.post('Companies', {
        Id: companyId,
        ResidentProvince: this.districts[0],
        ResidentCity: this.districts[1],
        ResidentArea: this.districts[2],
      }).then((response) => {
        this.$notify({
          title: '信息更新成功',
          message: `所在地更新为：${this.districts[0]} ${this.districts[1]} ${this.districts[2]}`,
          type: 'success',
          offset: 50
        });
        this.company.ResidentProvince = this.districts[0];
        this.company.ResidentCity = this.districts[1];
        this.company.ResidentArea = this.districts[2];
        this.districtFieldVisible = false;
      });
    },
    updateIndustryTypes() {
      var self = this;
      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      let typeIds = this.otherCatIds('b0d53699-dde9-e611-80e3-850a1737545e');
          typeIds = typeIds.concat(this.currentIndustryTypeIds);

      Vue.$http.post('Companies', {
        Id: companyId,
        CategoryIds: typeIds
      }).then((response) => {
        this.$notify({
          title: '更新成功',
          message: `行业类型已更新`,
          type: 'success',
          offset: 50
        });
        this.industryTypeFieldVisible = false;

        self.company.Categories = self.company.Categories.filter((catItem) => {
          return catItem.TypeId !== 'b0d53699-dde9-e611-80e3-850a1737545e';
        });

        _.forEach(this.currentIndustryTypeIds, function(typeId) {
          const tmpCat = self.industryTypes.filter((typeItem) => {
            return typeItem.Id === typeId;
          });

          self.company.Categories = self.company.Categories.concat(tmpCat);
        });
      });
    },
    updateIndustryCats() {
      var self = this;
      let companyId = localStorage.getItem('companyId');

      if (this.$store.state.route.params.id) {
        companyId = this.$store.state.route.params.id;
      }

      let catIds = this.otherCatIds('4d2d281e-de57-e611-b281-a00b61b73b60');
          catIds = catIds.concat(this.currentIndustryCatIds);

      Vue.$http.post('Companies', {
        Id: companyId,
        CategoryIds: catIds
      }).then((response) => {
        this.$notify({
          title: '更新成功',
          message: `行业分类已更新`,
          type: 'success',
          offset: 50
        });
        this.industryCatFieldVisible = false;

        self.company.Categories = self.company.Categories.filter((catItem) => {
          return catItem.TypeId !== '4d2d281e-de57-e611-b281-a00b61b73b60';
        });

        _.forEach(catIds, function(catId) {
          const tmpCat = self.industryCats.filter((catItem) => {
            return catItem.Id === catId;
          });

          self.company.Categories = self.company.Categories.concat(tmpCat);
        });

      });
    },
    decodedData(data) {
      let stringText = '';
      const compressed = window.atob(data);
      const zipArray = pako.ungzip(compressed);
      for (var i = 0; i < zipArray.length; ++i) {
        stringText += String.fromCharCode(zipArray[i]);
      }
      return JSON.parse(stringText);
    },
  },
  mounted() {
    if (this.$store.state.route.params.id) {
      const companyId = this.$store.state.route.params.id;
      this.fetchCompanyById(companyId);
      this.fetchEmployeesByCompany(companyId);
      this.fetchRoles();
    }
  },
  watch:{
    companyId() {
      this.fetchCompanyById(this.companyId);
      this.fetchEmployeesByCompany(this.companyId);
      if (this.$store.state.route.params.id) {
        this.fetchRoles();
      }
    }
  },
  directives: {
    editableInput: {
      bind: function (el, binding, vnode) {

        setTimeout(function() {

          $(el).editable();

          $(el).on('save', function(e, params) {
            const fieldObj = {};
            const fieldName = `${e.currentTarget.dataset.field}`;
            const maxLength = parseInt(e.currentTarget.dataset.maxlength);

            fieldObj['Id'] = `${e.currentTarget.dataset.id}`;
            fieldObj[fieldName] = params.newValue;

            if (params.newValue.length <= maxLength || !maxLength) {
              Vue.$http.post('/Companies', fieldObj).then(() => {

                if (fieldName === 'BrandName') {
                  store.dispatch('myIdentities/updateMyIdentity', {
                    handle: 'BrandName',
                    value: params.newValue
                  });
                }

                Vue.prototype.$notify({
                  title: '信息更新成功',
                  message: `${params.newValue}`,
                  type: 'success',
                  offset: 50
                });
                $(el).removeClass('editable-error');
              });
            } else {
              $(el).addClass('editable-error');
              Vue.prototype.$notify({
                title: '更新失败',
                message: `最多只能填写${maxLength}个字符`,
                type: 'error',
                offset: 50
              });
            }

          });

        }, 100);
      }
    },
    editableSelect: {
      bind: function (el, binding, vnode) {
        setTimeout(function() {
          let dataObj = {};
              dataObj['source'] = [];

          if (binding.value.currVal) {
            if (binding.value.currVal.length) {
              dataObj['value'] = binding.value.currVal[0].Id;
            }
          }

          _.forEach(binding.value.options, function(item) {
            dataObj['source'].push({
              value: item.Id,
              text: item.Name
            })
          });

          $(el).editable(dataObj);

          $(el).on('save', function(e, params) {
            const fieldObj = {};
            const fieldName = `${e.currentTarget.dataset.field}`;
            fieldObj['Id'] = `${e.currentTarget.dataset.id}`;
            fieldObj[fieldName] = binding.value.otherIds.concat(params.newValue);
            fieldObj['fields'] = 'Categories';

            Vue.$http.post('/Companies', fieldObj).then(() => {
              Vue.prototype.$notify({
                title: '信息更新成功',
                message: `${params.newValue}`,
                type: 'success',
                offset: 50
              });
            }).catch((error) => {
              Vue.prototype.$notify({
                title: '信息更新失败',
                message: `${error.response.data.Message}`,
                type: 'error',
                offset: 50
              });
            });
          });

        }, 100);
      }
    },
  }
};

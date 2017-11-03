/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';

import districts from '@/services/districts';

export default {
  data() {
    return {
      form: {
        name: null,
        brandName: null,
        address: null,
        business: null,
        category: '',
        industryTypes: [],
        industryProps: '',
        industryCategories: [],
        residents: [],
        isShowFullDetails:false
      },
      formRules: {
        brandName: [
          { max: 6, message: '长度需要小于 6 个字符', trigger: 'blur' }
        ],
      },
      options: districts,
    };
  },
  computed: {
    route() {
      return this.$store.state.route;
    },
    me() {
      const cIndex = this.$store.state.myIdentities.cIndex;
      const cIdentity = this.$store.state.myIdentities.list[cIndex];
      return cIdentity;
    },
    categories() {
      return this.$store.state.companyCats.companyCats;
    },
    industryTypes() {
      return this.$store.state.companyCats.industryTypes;
    },
    industryCategories() {
      return this.$store.state.companyCats.industryCats;
    },
    industryProps() {
      return this.$store.state.companyCats.industryProps;
    }
  },
  components: {
    VLayout: require('@/layouts/default/default.vue'),
    Avatar: require('@/components/avatar/avatar.vue'),
  },
  methods: {
    submit() {
      const categoryIds = [this.form.category]
        .concat(this.form.industryTypes)
        .concat(this.form.industryProps)
        .concat(this.form.industryCategories);

      Vue.$http.post('Companies/Register', {
        Name: this.form.name,
        BrandName: this.form.brandName,
        ResidentProvince: this.form.residents[0],
        ResidentCity: this.form.residents[1],
        ResidentArea: this.form.residents[2],
        Address: this.form.address,
        CustomMainBusiness: this.form.business,
        CategoryIds: categoryIds,
        IsShowFullDetails:this.form.isShowFullDetails
      }).then((response) => {
        this.$message({ message: '创建成功' });
        this.$router.push({ path: `/company/profile/${response.data.Id}` });
      }).catch((error) => {
        this.$message({ message: error.response.data.Message, type: 'error' });
      });
    }
  },
};

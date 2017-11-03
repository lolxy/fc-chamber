import Vue from 'vue';
import store from '@/store';

export default {
  data() {
    return {
      industryProperties: [],
      roleList: [
        {
          Id: '0',
          Name: '所有商户',
          Value: null
        },
        {
          Id: '1',
          Name: '商户（ 已认证 ）',
          Value: '商户'
        },
        {
          Id: '2',
          Name: '商户（ 未认证 ）',
          Value: '个体商户'
        },
        {
          Id: '3',
          Name: '公司（ 已认证 ）',
          Value: '公司'
        }
      ],
    }
  },
  computed: {
    categories() {
      const cats = [{
        Id: null,
        Name: '所有公司类型'
      }];
      return cats.concat(this.$store.state.companyCats.companyCats);
    },
    industry() {
      const cats = [{
        Id: null,
        Name: '所有行业'
      }];
      return cats.concat(this.$store.state.companyCats.industryCats);
    },
    industryTypes() {
      const cats = [{
        Id: null,
        Name: '所有行业类型'
      }];
      return cats.concat(this.$store.state.companyCats.industryTypes);
    },
    industryProps() {
      return this.$store.state.companyCats.industryProps;
    }
  },
  methods: {
    getCurrentIndustry(parentId) {
      return this.industry.filter(item => item.ParentId === parentId);
    },
    getCurrentIndustrySummary(parentId) {
      let industryList = this.industry.filter(item => item.ParentId === parentId);
      industryList = industryList.filter((item, index) => index < 3);
      const textArray = [];
      industryList.forEach((item) => {
        textArray.push(item.Name);
      })
      return textArray.join('、');
    }
  },
};

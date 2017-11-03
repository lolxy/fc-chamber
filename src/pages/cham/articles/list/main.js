import Vue from 'vue';

const articleList = r => require.ensure([], () => r(require('@/components/cham/articleList/main.vue')), 'article-list');
const categoryManager = r => require.ensure([], () => r(require('@/components/cham/categoryManager/main.vue')), 'category-manager');

export default {
  name: 'cham-article-list',
  data() {
    return {
      typeOptions:[
        {
          value: 'news',
          label: '资讯'
        }, {
          value: 'law',
          label: '法律'
        }, {
          value: 'tec',
          label: '新技术'
        }
      ],
      dialogCategoryVisible:false,
      currentModule:'news'
    }
  },
  components: {
    articleList: articleList,
    categoryManager:categoryManager
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    isMyCham() {
      const myChamId = Number(this.$store.state.myCham.cham.id);
      return Number(this.chamId) === myChamId;
    }
  },
  methods: {
    getCurrentList(type) {
      this.currentModule = type;
      this.$refs.article.getCurrentPageList(type);
    }
  }
};

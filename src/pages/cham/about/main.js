import Vue from 'vue';
import about from '@/components/cham/about/main.vue'
import organize from '@/components/cham/organize/main.vue'
import rules from '@/components/cham/rules/main.vue'

export default {
  name: 'cham-about',
  data() {
    return {
      navMenu:[
        {value:'about',name:'商会简介'},
        {value:'organize',name:'商会架构'},
        {value:'rules',name:'商会章程'}
      ],
      currentModule:'about',
      isMember:null
    }
  },
  components: {
    about,
    organize,
    rules
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    }
  },
  methods: {
    getCurrentModule(item) {
      this.currentModule = item;
    }
  }
};

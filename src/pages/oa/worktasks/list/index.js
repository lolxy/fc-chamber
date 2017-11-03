import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  data() {
    return {
      list: [],
      categories: [],
      currentCategory: null,
      currentPage: 0,
    }
  },
  components: {
    InfiniteLoading,
    vLayout: require('@/layouts/default/default.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    route() {
      return this.$store.state.route;
    }
  },
  mounted() {
    if (this.route.params.slug) {
      this.currentCategory = this.route.params.slug;
    } else {
      this.currentCategory = null;
    }
  },
  methods: {
    fetchList() {
      const meId = localStorage.getItem('meId');
      const listParams = {
        take: 12,
        fields: 'SubTasks,SubTaskCount,SubTaskCounts,Executors',
        parentId: '00000000-0000-0000-0000-000000000000',
        skip: this.currentPage * 12,
      };

      if (this.currentCategory !== 'assignedByMe') {
        listParams['ExecutorId'] = meId;
        listParams['stateByOr'] = '0,10';
      }

      if (this.currentCategory === 'completed') {
        listParams['ExecutorId'] = meId;
        listParams['stateByOr'] = '100';
      }

      if (this.currentCategory === 'assignedByMe') {
        listParams['SenderId'] = meId;
      }

      Vue.$http.get('../v1/WorkTasks', {
        params: listParams,
      }).then((response) => {
        let list = response.data;

        if (list.length) {
          this.list = this.list.concat(list);
          this.$refs.tasksInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (list.length < 12) {
            this.$refs.tasksInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentPage = this.currentPage + 1;
        } else {
          this.$refs.tasksInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    onListInfinite() {
      this.fetchList();
    },
    reloadList() {
      this.list = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.tasksInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    formatWorkTaskState(value) {
      if (value === 10) {
        return '进行中';
      }
      if (value === 100) {
        return '已完成';
      }
      return '待处理';
    },
    formatWorkTaskPriority(value) {
      if (value === 10) {
        return '紧急';
      }
      if (value === 100) {
        return '非常紧急';
      }
      return '一般';
    },
    formatTime(date) {
      const D = new Date(date);
      return `${D.getMonth() + 1}月${D.getDate()}日 ${D.getHours()}:${D.getMinutes()}`;
    },
    subTasksDoneCount(tasks) {
      return tasks.filter(item => item.State === 100).length;
    }
  },
  watch: {
    route(nVal, oVal) {
      this.reloadList();
      if (nVal.params.slug) {
        this.currentCategory = nVal.params.slug;
      } else {
        this.currentCategory = null;
      }
    },
  }
};

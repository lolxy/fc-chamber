import Vue from 'vue';
import store from '@/store';

export default {
  data() {
    return {
      task: {},
      taskLoaded: false,
      taskDueTime: null,
      executors: {}
    }
  },
  props: [
    'taskId',
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    vLayout: require('@/layouts/default/default.vue'),
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    meId() {
      return localStorage.getItem('meId');
    }
  },
  mounted() {
    this.fetchTaskById();
  },
  methods: {
    resetTask() {
      this.task = {};
      this.taskLoaded = false;
      this.executors = {};
    },
    fetchTaskById() {
      this.resetTask();
      const entryParams = {
        fields: 'Sender,Sender.User,Company,Parent,TopParentId,SubTasks,SubTaskCount,SubTaskCounts,Executors,Logs,LogCount,TotalLogCount'
      };
      
      Vue.$http.get(`../v1/WorkTasks/${this.taskId}`, {
        params: entryParams,
      }).then((response) => {
        this.task = response.data;
        this.taskLoaded = true;
        this.taskDueTime = this.task.DueTime;
        this.fetchTaskExecutorsByTaskId(this.task.Id);
        if (this.task.SubTaskCount) {
          this.task.SubTasks.forEach((task) => {
            this.fetchTaskExecutorsByTaskId(task.Id);
          })
        }
      }).catch((error) => {
        this.taskLoaded = true;
      });
    },
    fetchTaskExecutorsByTaskId(taskId) {
      Vue.$http.get(`../v1/WorkTaskExecutors?WorkTaskId=${taskId}&fields=Executor,Executor.User`).then((response) => {
        Vue.set(this.executors, `task-${taskId}`, response.data);
      });
    },
    formatTime(date) {
      const D = new Date(date);
      return `${D.getMonth() + 1}月${D.getDate()}日 ${D.getHours()}:${D.getMinutes()}`;
    },
    formatWorkTaskPriority(value) {
      if (value === 10) {
        return '紧急';
      }
      if (value === 100) {
        return '非常紧急';
      }
      return '普通';
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
    sessionWith(accid) {
      const self = this;
      window.nim.insertLocalSession({
        scene: 'p2p',
        to: accid,
        done(error, session) {
          store.dispatch('nim/switchNimCurrentSession', `p2p-${accid}`);
          store.dispatch('contact/switchContactPanel', 'contact.sessions');
          store.dispatch('contact/toggleContactPanel', true);
        }
      });
    },
    isSender(senderId) {
      if (senderId === this.meId) {
        return true;
      }
      return false;
    },
    updateTaskPriority(priorityValue) {
      Vue.$http.post('../v1/WorkTasks', {
        Id: this.taskId,
        Priority: priorityValue
      }).then(() => {
        this.task.Priority = priorityValue;
      });
    },
    updateTaskState(stateValue) {
      Vue.$http.post('../v1/WorkTasks/UpdateState', {
        Id: this.taskId,
        State: stateValue
      }).then(() => {
        this.task.State = stateValue;
      });
    },
    updateTaskDueTime(date) {
      const DateString = new Date(date).toISOString();
      Vue.$http.post('../v1/WorkTasks', {
        Id: this.taskId,
        DueTime: DateString
      }).then(() => {
        this.task.DueTime = DateString;
      });
    }
  },
  watch: {
    taskId() {
      this.fetchTaskById();
    }
  }
};

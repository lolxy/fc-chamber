<template>
  <div class="main-wrap" :class="{'contact-panel-open': contact.panelVisible}">
    <router-view></router-view>
    <contact-sessions v-show="contact.panelVisible && contact.activePanel == 'contact.sessions'"></contact-sessions>
    <contact-list v-show="contact.panelVisible && contact.activePanel == 'contact.list'"></contact-list>
  </div>
</template>
<script>

  import Vue from 'vue';
  import store from '@/store';
  import { router } from './bootstrap';
  import myService from '@/services/my';
  import companyService from '@/services/company';

  const contactSessions = r => require.ensure([], () => r(require('@/components/contact/sessions/main.vue')), 'sessions-main');
  const contactList = r => require.ensure([], () => r(require('@/components/contact/list/main.vue')), 'contact-list');

  export default {
    store,
    router,
    components: {
      contactSessions,
      contactList
    },
    computed: {
      contact() {
        return store.state.contact;
      },
    },
    mounted() {
      if (store.state.auth.authenticated) {
        myService.init();
      } else {
        Vue.$http.get('/Account/Me').then(() => {
          store.dispatch('auth/login');
          myService.init();
        });
      }
      companyService.init();
    },
  };
</script>

<template>
  <div class="main-wrap">
    <router-view></router-view>
  </div>
</template>
<script>

  import Vue from 'vue';
  import store from '@/store';
  import { router } from './bootstrap';
  import myService from '@/services/my';
  import companyService from '@/services/company';

  export default {
    store,
    router,
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

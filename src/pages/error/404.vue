<template>
  <main class="page-main">
    <div class="row">
      <div class="small-12 column text-center">
        <h1 class="title">404</h1>
        <h2 class="info">404 Page Not Found</h2>
      </div>
    </div>
  </main>
</template>

<script lang="babel">
export default {
  props: ['error']
};
</script>

<style scoped>
  .title
  {
    margin-top: 15px;
    font-size: 5em;
  }
  .info
  {
    font-weight: 300;
    color: #000;
    margin: 0;
  }
</style>

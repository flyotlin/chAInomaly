<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style>
  body {
    margin: 0;
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Open Sans',
      'Helvetica Neue',
      sans-serif;
  }

  .container {
    width: 100%;
    max-width: 100%;
  }
</style>

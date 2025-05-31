<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, provide, reactive } from 'vue';

  // Create and provide the selected transactions state
  const selectedTransactions = reactive({
    set: new Set<string>()
  });

  provide('selectedTransactions', selectedTransactions);
</script>

<template>
  <RouterView />
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

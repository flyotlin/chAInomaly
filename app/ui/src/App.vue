<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, provide, reactive } from 'vue';
  import TransactionList from './components/TransactionList.vue';
  import Chat from './components/Chat.vue';

  // Create and provide the selected transactions state
  const selectedTransactions = reactive({
    set: new Set<string>()
  });

  provide('selectedTransactions', selectedTransactions);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Chain Anomaly Detector</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TransactionList />
        <Chat />
      </div>
    </main>
  </div>
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

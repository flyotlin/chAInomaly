<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TransactionList from './components/TransactionList.vue'
import { ref } from 'vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
    <nav class="bg-white shadow-lg w-full">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Chain Anomaly Detector
              </h1>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-500">Powered by Blockscout</span>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-grow flex items-center justify-center w-full py-32">
      <div class="container mx-auto px-8 sm:px-12 lg:px-16">
        <div class="text-center mb-12 py-5">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">OP Mainnet Transaction Explorer</h2>
          <p class="text-lg text-gray-600 py-2">Enter an Ethereum address to view its recent transactions</p>
        </div>
        <TransactionList />
      </div>
    </main>

    <footer class="bg-white shadow-lg w-full mt-auto">
      <div class="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          Built for ETH Prague 2025
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  width: 100%;
  max-width: 100%;
}
</style>

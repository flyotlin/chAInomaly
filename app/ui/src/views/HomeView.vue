<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
  import TransactionList from '../components/TransactionList.vue';
  import { ref } from 'vue';

  import GraphSection from '../components/GraphSection.vue';
  import Chat from '../components/Chat.vue';

  interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: string;
    blockNumber: number;
    method: string | null;
    status: string;
    fee: {
      value: string;
    };
  }

  const address = ref('0x123...'); // Replace with your actual address
  const transactions = ref<Transaction[]>([]); // Replace with your actual transactions
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
    <nav class="bg-white shadow-lg w-full">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                chAInomaly
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
          <div class="flex flex-col items-center">
            <h2
              class="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              chAInomaly
            </h2>
            <span class="text-2xl text-gray-600 font-normal">Transaction Analyzer</span>
          </div>
          <p class="text-lg text-gray-600 py-2 flex items-center justify-center gap-2">
            <svg
              class="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Enter an Ethereum address to view its recent transactions on OP Mainnet
          </p>
        </div>
        <TransactionList />
      </div>
    </main>

    <footer class="bg-white shadow-lg w-full mt-auto">
      <div class="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">Built for ETH Prague 2025</p>
      </div>
    </footer>

    <Chat />
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

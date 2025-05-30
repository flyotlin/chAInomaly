<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Blockchain Address Analyzer</h1>
      
      <!-- Address Input -->
      <div class="mb-8">
        <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
          Enter Ethereum Address
        </label>
        <div class="flex gap-2">
          <input
            id="address"
            v-model="address"
            type="text"
            placeholder="0x..."
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            :class="{ 'border-red-500': error }"
          />
          <button
            @click="analyzeAddress"
            :disabled="isLoading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ isLoading ? 'Analyzing...' : 'Analyze' }}
          </button>
        </div>
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Analysis Results -->
      <div v-if="analysis" class="space-y-6">
        <!-- Basic Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Total Transactions</h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900">
              <!-- {{ analysis.totalTransactions.toLocaleString() }} -->
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Total Volume</h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900">
              <!-- {{ formatEther(analysis.totalVolume) }} ETH -->
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Average Transaction</h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900">
              <!-- {{ formatEther(analysis.averageTransactionValue) }} ETH -->
            </p>
          </div>
        </div>

        <!-- Anomalies -->
        <!-- <div v-if="analysis.anomalies.length > 0">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Detected Anomalies</h2>
          <div class="space-y-4">
            <div
              v-for="(anomaly, index) in analysis.anomalies"
              :key="index"
              class="p-4 rounded-lg"
              :class="{
                'bg-red-50': anomaly.severity === 'high',
                'bg-yellow-50': anomaly.severity === 'medium',
                'bg-blue-50': anomaly.severity === 'low'
              }"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5"
                    :class="{
                      'text-red-400': anomaly.severity === 'high',
                      'text-yellow-400': anomaly.severity === 'medium',
                      'text-blue-400': anomaly.severity === 'low'
                    }"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium" :class="{
                    'text-red-800': anomaly.severity === 'high',
                    'text-yellow-800': anomaly.severity === 'medium',
                    'text-blue-800': anomaly.severity === 'low'
                  }">
                    {{ anomaly.type.replace('_', ' ').toUpperCase() }}
                  </h3>
                  <p class="mt-1 text-sm" :class="{
                    'text-red-700': anomaly.severity === 'high',
                    'text-yellow-700': anomaly.severity === 'medium',
                    'text-blue-700': anomaly.severity === 'low'
                  }">
                    {{ anomaly.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No anomalies detected for this address.</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BlockchainService } from '../services/blockchainService';
import { formatEther } from 'ethers';

const address = ref('');
const analysis = ref(null);
const isLoading = ref(false);
const error = ref('');

const blockchainService = new BlockchainService();

const analyzeAddress = async () => {
  if (!address.value) {
    error.value = 'Please enter an address';
    return;
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address.value)) {
    error.value = 'Please enter a valid Ethereum address';
    return;
  }

  error.value = '';
  isLoading.value = true;

  // try {
  //   analysis.value = await blockchainService.analyzeAddress(address.value);
  // } catch (err) {
  //   error.value = 'Failed to analyze address. Please try again.';
  //   console.error(err);
  // } finally {
  //   isLoading.value = false;
  // }
};
</script> 
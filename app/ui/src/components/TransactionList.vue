<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  blockNumber: number
}

const address = ref('')
const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')

const fetchTransactions = async () => {
  if (!address.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`https://optimism.blockscout.com/api/v2/addresses/${address.value}/transactions`)
    const data = await response.json()
    
    if (data.data) {
      transactions.value = data.data.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from.hash,
        to: tx.to.hash,
        value: (Number(tx.value) / 1e18).toFixed(4) + ' ETH',
        timestamp: new Date(tx.timestamp).toLocaleString(),
        blockNumber: tx.block
      }))
    }
  } catch (e) {
    error.value = 'Failed to fetch transactions'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div class="mb-6 max-w-2xl w-full">
      <label for="address" class="block text-sm font-medium text-gray-700">Ethereum Address</label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          id="address"
          v-model="address"
          class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="0x..."
          @keyup.enter="fetchTransactions"
        />
        <button
          @click="fetchTransactions"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <div v-if="transactions.length > 0" class="bg-white shadow overflow-hidden sm:rounded-md w-full">
      <ul class="divide-y divide-gray-200">
        <li v-for="tx in transactions" :key="tx.hash" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-indigo-600 truncate">
                {{ tx.hash }}
              </p>
              <p class="text-sm text-gray-500">
                From: {{ tx.from }}
              </p>
              <p class="text-sm text-gray-500">
                To: {{ tx.to }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0">
              <p class="text-sm font-medium text-gray-900">{{ tx.value }}</p>
              <p class="text-sm text-gray-500">Block: {{ tx.blockNumber }}</p>
              <p class="text-sm text-gray-500">{{ tx.timestamp }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template> 
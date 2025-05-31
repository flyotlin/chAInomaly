<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateText, type GeminiResponse } from '../services/gemini'
import { marked } from 'marked'

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  blockNumber: number
  method: string | null
  status: string
  fee: {
    value: string
  }
}

interface NextPageParams {
  block_number: number
  index: number
  items_count: number
}

const address = ref('')
const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const hasMore = ref(true)
const nextPageParams = ref<NextPageParams | null>(null)
const analysis = ref<GeminiResponse | null>(null)
const analyzing = ref(false)

const analyzeTransactions = async () => {
  if (transactions.value.length === 0) return

  analyzing.value = true
  try {
    // Create a prompt that includes transaction details
    const prompt = `Analyze these Ethereum transactions and identify any potential anomalies or suspicious patterns:

${transactions.value.map(tx => `
Transaction Hash: ${tx.hash}
From: ${tx.from}
To: ${tx.to}
Value: ${tx.value}
Method: ${tx.method}
Status: ${tx.status}
Fee: ${tx.fee.value}
Timestamp: ${tx.timestamp}
Block Number: ${tx.blockNumber}
`).join('\n')}

Please provide a detailed analysis focusing on:
1. Unusual transaction patterns and anomaly
2. Potential security concerns
3. Suspicious activity indicators
4. Recommendations for further investigation
5. A short summary for the transaction

Please format your response using markdown for better readability.`

    analysis.value = await generateText(prompt)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to analyze transactions'
  } finally {
    analyzing.value = false
  }
}

const fetchTransactions = async (isNewSearch: boolean = false) => {
  if (!address.value) return
  
  loading.value = true
  error.value = ''
  analysis.value = null
  
  try {
    let url = `https://optimism.blockscout.com/api/v2/addresses/${address.value}/transactions`
    
    if (isNewSearch) {
      // Reset pagination for new search
      nextPageParams.value = null
      currentPage.value = 1
    } else if (nextPageParams.value) {
      // Append next page parameters
      const params = new URLSearchParams({
        block_number: nextPageParams.value.block_number.toString(),
        index: nextPageParams.value.index.toString(),
        items_count: nextPageParams.value.items_count.toString()
      })
      url += `?${params.toString()}`
    }

    const response = await fetch(url)
    const data = await response.json()
    
    if (data.items) {
      transactions.value = data.items.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from.hash,
        to: tx.to.hash,
        value: tx.value === "0" ? "0 ETH" : (Number(tx.value) / 1e18).toFixed(6) + ' ETH',
        timestamp: new Date(tx.timestamp).toLocaleString(),
        blockNumber: tx.block_number,
        method: tx.method || 'transfer',
        status: tx.status,
        fee: {
          value: (Number(tx.fee.value) / 1e18).toFixed(6) + ' ETH'
        }
      }))
      hasMore.value = data.next_page_params !== null
      nextPageParams.value = data.next_page_params
      if (!isNewSearch) {
        currentPage.value++
      }
      
      // Automatically analyze transactions after fetching
      await analyzeTransactions()
    }
  } catch (e) {
    error.value = 'Failed to fetch transactions'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadNextPage = () => {
  if (!loading.value && hasMore.value) {
    fetchTransactions()
  }
}

const loadPreviousPage = () => {
  // Since Blockscout API doesn't support going back, we'll need to start a new search
  if (!loading.value && currentPage.value > 1) {
    fetchTransactions(true)
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div class="mb-16 max-w-2xl w-full">
      <label for="address" class="block text-sm font-medium text-gray-700">Ethereum Address</label>
      <div class="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          id="address"
          v-model="address"
          class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="0x..."
          @keyup.enter="fetchTransactions(true)"
        />
        <button
          @click="fetchTransactions(true)"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="text-red-600 mb-8">{{ error }}</div>

    <!-- Analysis Section -->
    <div v-if="analyzing" class="w-full max-w-2xl mb-8">
      <div class="bg-white shadow rounded-lg p-4">
        <p class="text-gray-600">Analyzing transactions...</p>
      </div>
    </div>

    <div v-if="analysis?.text" class="w-full max-w-2xl mb-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Transaction Analysis</h3>
        <div class="prose prose-sm max-w-none" v-html="marked(analysis.text)"></div>
      </div>
    </div>

    <div v-if="transactions.length > 0" class="mt-8 bg-white shadow overflow-hidden sm:rounded-md w-full">
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
              <p class="text-sm text-gray-500">
                Method: {{ tx.method }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 text-right">
              <p class="text-sm font-medium text-gray-900">{{ tx.value }}</p>
              <p class="text-sm text-gray-500">Block: {{ tx.blockNumber }}</p>
              <p class="text-sm text-gray-500">{{ tx.timestamp }}</p>
              <p class="text-sm text-gray-500">Fee: {{ tx.fee.value }}</p>
              <p class="text-sm" :class="tx.status === 'ok' ? 'text-green-500' : 'text-red-500'">
                {{ tx.status }}
              </p>
            </div>
          </div>
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="loadPreviousPage"
            :disabled="loading || currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="loadNextPage"
            :disabled="loading || !hasMore"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Page <span class="font-medium">{{ currentPage }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="loadPreviousPage"
                :disabled="loading || currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="loadNextPage"
                :disabled="loading || !hasMore"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.prose {
  max-width: 65ch;
  color: #374151;
}

.prose h1 {
  color: #111827;
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}

.prose h2 {
  color: #111827;
  font-weight: 700;
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.prose h3 {
  color: #111827;
  font-weight: 600;
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.6;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  list-style-type: disc;
  padding-left: 1.625em;
}

.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  list-style-type: decimal;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose code {
  color: #111827;
  font-weight: 600;
  font-size: 0.875em;
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
}

.prose pre {
  color: #e5e7eb;
  background-color: #1f2937;
  overflow-x: auto;
  font-size: 0.875em;
  line-height: 1.7142857;
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
  border-radius: 0.375rem;
  padding: 0.8571429em 1.1428571em;
}

.prose blockquote {
  font-weight: 500;
  font-style: italic;
  color: #111827;
  border-left-width: 0.25rem;
  border-left-color: #e5e7eb;
  quotes: "\201C""\201D""\2018""\2019";
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}
</style> 
<script setup lang="ts">
import { ref } from 'vue'
import { generateText, type GeminiResponse } from '../services/gemini'
import SearchInput from './SearchInput.vue'
import TransactionAnalysis from './TransactionAnalysis.vue'
import TransactionItem from './TransactionItem.vue'
import Pagination from './Pagination.vue'
import CollapsibleHeader from './CollapsibleHeader.vue'

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
const isHistoryExpanded = ref(true)

const toggleHistory = () => {
  isHistoryExpanded.value = !isHistoryExpanded.value
}

const analyzeTransactions = async () => {
  if (transactions.value.length === 0) return

  analyzing.value = true
  try {
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
      nextPageParams.value = null
      currentPage.value = 1
    } else if (nextPageParams.value) {
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
  if (!loading.value && currentPage.value > 1) {
    fetchTransactions(true)
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center space-y-8">
    <SearchInput
      v-model:address="address"
      :loading="loading"
      @search="fetchTransactions(true)"
    />

    <div v-if="error" class="text-red-600">{{ error }}</div>

    <TransactionAnalysis
      :analyzing="analyzing"
      :analysis="analysis"
    />

    <div v-if="transactions.length > 0" class="w-full max-w-2xl">
      <div class="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
        <CollapsibleHeader
          title="Transaction History"
          :is-expanded="isHistoryExpanded"
          @toggle="toggleHistory"
        />

        <div v-if="isHistoryExpanded" class="transition-all duration-200 ease-in-out">
          <ul class="divide-y divide-gray-200">
            <TransactionItem
              v-for="tx in transactions"
              :key="tx.hash"
              :transaction="tx"
            />
          </ul>

          <Pagination
            :current-page="currentPage"
            :loading="loading"
            :has-more="hasMore"
            @previous="loadPreviousPage"
            @next="loadNextPage"
          />
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
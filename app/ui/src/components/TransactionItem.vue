<script setup lang="ts">
import { ref } from 'vue'
import { generateText } from '../services/gemini'

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

const props = defineProps<{
  transaction: Transaction
}>()

const isExpanded = ref(false)
const summary = ref('')
const isGeneratingSummary = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const truncateHash = (hash: string) => {
  return hash.slice(0, 16) + '...'
}

const generateSummary = async () => {
  if (summary.value || isGeneratingSummary.value) return
  
  isGeneratingSummary.value = true
  try {
    const prompt = `Analyze this Ethereum transaction and provide a very brief summary in 1-2 sentences:

Transaction Hash: ${props.transaction.hash}
From: ${props.transaction.from}
To: ${props.transaction.to}
Value: ${props.transaction.value}
Method: ${props.transaction.method}
Status: ${props.transaction.status}
Fee: ${props.transaction.fee.value}
Timestamp: ${props.transaction.timestamp}
Block Number: ${props.transaction.blockNumber}

Focus only on the most important aspects. Keep it extremely concise.`

    const response = await generateText(prompt)
    summary.value = response.text
  } catch (error) {
    console.error('Failed to generate summary:', error)
    summary.value = 'Failed to generate summary'
  } finally {
    isGeneratingSummary.value = false
  }
}
</script>

<template>
  <li class="px-6 py-6 hover:bg-gray-50 transition duration-150 ease-in-out">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-start space-x-6">
          <div class="flex-shrink-0 pr-4">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <div class="group relative">
                <p class="text-sm font-medium text-indigo-600">
                  {{ truncateHash(transaction.hash) }}
                </p>
                <div class="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                  <div class="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {{ transaction.hash }}
                  </div>
                  <div class="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-4"></div>
                </div>
              </div>
            </div>
            <div class="mt-2">
              <span class="text-sm text-gray-500">{{ transaction.timestamp }}</span>
              <span class="mx-2 text-gray-300">•</span>
              <span 
                class="text-sm font-medium"
                :class="transaction.status === 'ok' ? 'text-green-600' : 'text-red-600'"
              >
                {{ transaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="ml-6 flex-shrink-0 text-right min-w-[200px]">
        <div class="flex flex-col items-end">
          <p class="text-sm font-medium text-gray-900">{{ transaction.value }}</p>
          <p class="text-sm text-gray-500">Fee: {{ transaction.fee.value }}</p>
        </div>
      </div>
      <div class="ml-4 flex-shrink-0 flex items-center space-x-2">
        <div class="group relative">
          <button 
            class="text-gray-400 hover:text-gray-500 focus:outline-none px-2"
            @mouseenter="generateSummary"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="absolute right-0 bottom-full mb-2 hidden group-hover:block w-96">
            <div class="bg-gray-900 text-white text-xs rounded py-3 px-4 max-h-48 overflow-y-auto">
              <div v-if="isGeneratingSummary" class="flex items-center space-x-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating summary...</span>
              </div>
              <div v-else class="whitespace-normal leading-relaxed">
                {{ summary || 'Hover to generate summary' }}
              </div>
            </div>
            <div class="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 right-4"></div>
          </div>
        </div>

      <div class="group relative">
        <button
          @click="toggleExpand"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg
            class="h-5 w-5 transform transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      </div>
    </div>

    <!-- Collapsible Details Section -->
    <div
      v-show="isExpanded"
      class="mt-4 pl-20 transition-all duration-200 ease-in-out"
    >
      <div class="border-t border-gray-200 pt-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-700 w-16">From:</span>
            <span class="text-gray-500 truncate">{{ transaction.from }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-700 w-16">To:</span>
            <span class="text-gray-500 truncate">{{ transaction.to }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-700 w-16">Method:</span>
            <span class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              {{ transaction.method }}
            </span>
          </div>
          <div class="flex items-center text-sm">
            <span class="font-medium text-gray-700 w-16">Block:</span>
            <span class="text-gray-500">{{ transaction.blockNumber }}</span>
          </div>
        </div>
      </div>
    </div>
  </li>
</template> 
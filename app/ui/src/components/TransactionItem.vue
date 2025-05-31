<script setup lang="ts">
import { ref } from 'vue'

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
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
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
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-indigo-600 truncate">
                {{ transaction.hash }}
              </p>
              <button 
                @click="toggleExpand"
                class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
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
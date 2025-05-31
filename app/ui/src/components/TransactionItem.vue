<script setup lang="ts">
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

defineProps<{
  transaction: Transaction
}>()
</script>

<template>
  <li class="px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-indigo-600 truncate">
          {{ transaction.hash }}
        </p>
        <p class="text-sm text-gray-500">
          From: {{ transaction.from }}
        </p>
        <p class="text-sm text-gray-500">
          To: {{ transaction.to }}
        </p>
        <p class="text-sm text-gray-500">
          Method: {{ transaction.method }}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0 text-right">
        <p class="text-sm font-medium text-gray-900">{{ transaction.value }}</p>
        <p class="text-sm text-gray-500">Block: {{ transaction.blockNumber }}</p>
        <p class="text-sm text-gray-500">{{ transaction.timestamp }}</p>
        <p class="text-sm text-gray-500">Fee: {{ transaction.fee.value }}</p>
        <p class="text-sm" :class="transaction.status === 'ok' ? 'text-green-500' : 'text-red-500'">
          {{ transaction.status }}
        </p>
      </div>
    </div>
  </li>
</template> 
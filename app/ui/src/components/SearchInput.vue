<script setup lang="ts">
defineProps<{
  address: string
  loading: boolean
}>()

defineEmits<{
  (e: 'update:address', value: string): void
  (e: 'search'): void
}>()
</script>

<template>
  <div class="mb-16 max-w-2xl w-full">
    <label for="address" class="pb-3 block text-sm font-medium text-gray-700">Ethereum Address</label>
    <div class="mt-1 flex rounded-lg shadow-sm">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          id="address"
          :value="address"
          @input="$emit('update:address', ($event.target as HTMLInputElement).value)"
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black transition duration-150 ease-in-out"
          placeholder="Enter Ethereum address (0x...)"
          @keyup.enter="$emit('search')"
        />
      </div>
      <button
        @click="$emit('search')"
        class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-r-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? 'Searching...' : 'Search' }}
      </button>
    </div>
  </div>
</template> 
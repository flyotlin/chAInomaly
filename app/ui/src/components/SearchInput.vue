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
    <div class="mt-1 flex rounded-md shadow-sm">
      <input
        type="text"
        id="address"
        :value="address"
        @input="$emit('update:address', ($event.target as HTMLInputElement).value)"
        class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        placeholder="0x..."
        @keyup.enter="$emit('search')"
      />
      <button
        @click="$emit('search')"
        class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :disabled="loading"
      >
        {{ loading ? 'Loading...' : 'Search' }}
      </button>
    </div>
  </div>
</template> 
<script setup lang="ts">
defineProps<{
  currentPage: number
  loading: boolean
  hasMore: boolean
}>()

defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="bg-white px-3 py-2 flex items-center justify-between border-t border-gray-200 sm:px-4">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="$emit('previous')"
        :disabled="loading || currentPage === 1"
        class="relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
      >
        <svg class="mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="loading || !hasMore"
        class="ml-3 relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
      >
        Next
        <svg class="ml-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Page <span class="font-medium">{{ currentPage }}</span>
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-lg -space-x-px" aria-label="Pagination">
          <button
            @click="$emit('previous')"
            :disabled="loading || currentPage === 1"
            class="relative inline-flex items-center px-3 py-1.5 rounded-l-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="relative inline-flex items-center px-3 py-1.5 border border-gray-200 bg-white text-sm font-medium text-gray-700">
            Page {{ currentPage }}
          </div>
          <button
            @click="$emit('next')"
            :disabled="loading || !hasMore"
            class="relative inline-flex items-center px-3 py-1.5 rounded-r-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
          >
            <span class="sr-only">Next</span>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template> 
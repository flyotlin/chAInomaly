<script setup lang="ts">
import { ref } from 'vue'
import CollapsibleHeader from './CollapsibleHeader.vue'

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <div class="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
      <CollapsibleHeader
        title="Transaction Graph"
        :is-expanded="isExpanded"
        @toggle="toggleExpand"
      />

      <div v-if="isExpanded" class="p-6 border-t border-gray-100">
        <div class="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Graph visualization will be displayed here</p>
        </div>
      </div>
    </div>
  </div>
</template> 
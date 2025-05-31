<script setup lang="ts">
import { ref } from 'vue'
import { marked } from 'marked'
import CollapsibleHeader from './CollapsibleHeader.vue'

const props = defineProps<{
  analyzing: boolean
  analysis: { text: string } | null
}>()

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div v-if="analyzing || analysis?.text" class="w-full max-w-2xl mb-8">
    <div class="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
      <CollapsibleHeader
        title="Transaction Analysis"
        :is-expanded="isExpanded"
        @toggle="toggleExpand"
      />

      <div v-if="analyzing" class="p-6 border-t border-gray-100">
        <div class="flex items-center space-x-3">
          <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 font-medium">Analyzing transactions...</p>
        </div>
      </div>

      <div 
        v-if="analysis?.text && isExpanded" 
        class="p-6 border-t border-gray-100 transition-all duration-200 ease-in-out"
      >
        <div class="prose prose-sm max-w-none" v-html="marked(analysis.text)"></div>
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
<script setup lang="ts">
import { ref } from 'vue';
import { generateText, generateChatResponse, type GeminiResponse } from '../services/gemini';

const prompt = ref('');
const response = ref<GeminiResponse | null>(null);
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (!prompt.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    response.value = await generateText(prompt.value);
    if (response.value.error) {
      error.value = response.value.error;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-4">
    <div class="mb-4">
      <label for="prompt" class="block text-sm font-medium text-gray-700">Enter your prompt</label>
      <div class="mt-1">
        <textarea
          id="prompt"
          v-model="prompt"
          rows="4"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Type your prompt here..."
        ></textarea>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {{ loading ? 'Generating...' : 'Generate' }}
      </button>
    </div>

    <div v-if="error" class="mt-4 text-red-600">
      {{ error }}
    </div>

    <div v-if="response?.text" class="mt-4 p-4 bg-gray-50 rounded-md">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Response:</h3>
      <p class="text-gray-900 whitespace-pre-wrap">{{ response.text }}</p>
    </div>
  </div>
</template> 
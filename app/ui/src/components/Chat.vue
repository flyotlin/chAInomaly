<script setup lang="ts">
import { ref, onMounted, inject, computed, watch } from 'vue';
import { sendMessage, loadChatHistory, saveChatHistory, type ChatMessage } from '../services/gemini';
import { marked } from 'marked';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  blockNumber: number;
  method: string | null;
  status: string;
  fee: {
    value: string;
  };
}

const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const isGenerating = ref(false);

// Get the selected transactions from the parent
const selectedTransactions = inject<{ set: Set<string>, data: Map<string, Transaction> }>('selectedTransactions', { set: new Set(), data: new Map() });

// Create a computed property to track selected transactions
const selectedTransactionsList = computed(() => Array.from(selectedTransactions.data.values()));

// Watch for changes to selected transactions
watch(selectedTransactionsList, (newList) => {
  console.log('Selected transactions changed:', newList);
}, { immediate: true });

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  console.log('Selected transactions:', selectedTransactionsList.value);
};

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || isGenerating.value) return;
  
  const userMessage: ChatMessage = {
    text: newMessage.value,
    isUser: true,
    timestamp: new Date().toISOString()
  };
  
  messages.value.push(userMessage);
  newMessage.value = '';
  isGenerating.value = true;
  
  try {
    // Include transaction context in the prompt if available
    let prompt = userMessage.text;
    if (selectedTransactionsList.value.length > 0) {
      const context = `Context: Analyzing the following transactions:\n${selectedTransactionsList.value.map((tx: Transaction) => `
Transaction ${tx.hash}:
- Hash: ${tx.hash}
- From: ${tx.from}
- To: ${tx.to}
- Value: ${tx.value}
- Method: ${tx.method}
- Status: ${tx.status}
- Fee: ${tx.fee.value}
- Timestamp: ${tx.timestamp}
- Block Number: ${tx.blockNumber}
`).join('\n')}\n\nQuestion: ${userMessage.text}`;
      prompt = context;
    }

    const response = await sendMessage(prompt);
    messages.value.push({
      text: response,
      isUser: false,
      timestamp: new Date().toISOString()
    });
    saveChatHistory();
  } catch (error) {
    console.error('Failed to get response:', error);
    messages.value.push({
      text: 'Sorry, I encountered an error. Please try again.',
      isUser: false,
      timestamp: new Date().toISOString()
    });
  } finally {
    isGenerating.value = false;
  }
};

onMounted(async () => {
  const savedMessages = await loadChatHistory();
  if (savedMessages.length > 0) {
    messages.value = savedMessages;
  }
});
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors duration-200"
    >
      <svg
        class="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>

    <!-- Chat Dialog -->
    <div v-else class="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b flex justify-between items-center bg-indigo-600 text-white rounded-t-lg">
        <div class="flex items-center space-x-2">
          <h3 class="font-medium">Chat with Gemini</h3>
          <div v-if="selectedTransactionsList.length > 0" class="flex items-center space-x-2">
            <span class="text-xs bg-indigo-500 px-2 py-1 rounded-full">
              {{ selectedTransactionsList.length }} selected
            </span>
          </div>
        </div>
        <button
          @click="toggleChat"
          class="text-white hover:text-gray-200 transition-colors duration-200"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- Selected Transactions Preview -->
        <div v-if="selectedTransactionsList.length > 0" class="bg-indigo-50 rounded-lg p-4 mb-4">
          <div class="text-sm text-indigo-800 font-medium mb-2">Selected Transactions:</div>
          <div class="space-y-2">
            <div v-for="tx in selectedTransactionsList" :key="tx.hash" class="text-xs text-indigo-600 font-mono">
              {{ tx.hash.slice(0, 12) }}
            </div>
          </div>
        </div>

        <div
          v-for="(message, index) in messages"
          :key="index"
          style="margin-bottom: 1rem; margin-top: 1rem"
          :class="[
            'max-w-[80%] rounded-2xl p-4 shadow-sm',
            message.isUser
              ? 'bg-indigo-600 text-white ml-auto rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none',
          ]"
        >
          <div 
            class="text-sm prose prose-sm max-w-none break-words"
            :class="message.isUser ? 'prose-invert' : ''"
            v-html="message.isUser ? message.text : marked(message.text)"
          ></div>
          <div :class="['text-xs mt-1', message.isUser ? 'text-indigo-200' : 'text-gray-500']">
            {{ new Date(message.timestamp).toLocaleTimeString() }}
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t bg-gray-50">
        <form @submit.prevent="handleSendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            :placeholder="selectedTransactionsList.length > 0 ? 'Ask about the selected transactions...' : 'Type your message...'"
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
            :disabled="isGenerating"
          />
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isGenerating"
          >
            <span v-if="isGenerating">...</span>
            <span v-else>Send</span>
          </button>
        </form>
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
  max-width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.prose blockquote {
  font-weight: 500;
  font-style: italic;
  color: #111827;
  border-left-width: 0.25rem;
  border-left-color: #e5e7eb;
  quotes: '\201C' '\201D' '\2018' '\2019';
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}

/* Invert colors for user messages */
.prose-invert {
  color: #e5e7eb;
}

.prose-invert h1,
.prose-invert h2,
.prose-invert h3 {
  color: #f9fafb;
}

.prose-invert code {
  color: #f9fafb;
  background-color: #374151;
}

.prose-invert blockquote {
  color: #f9fafb;
  border-left-color: #4b5563;
}

.prose code {
  color: #111827;
  font-weight: 600;
  font-size: 0.875em;
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  word-break: break-word;
}
</style>

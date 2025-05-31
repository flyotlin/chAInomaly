<script setup lang="ts">
import { ref, onMounted, inject, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { sendMessage, loadChatHistory, saveChatHistory, type ChatMessage } from '../services/gemini';

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
            <span class="mx-4 text-xs bg-indigo-500 px-2 py-1 rounded-full">
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
          <div class="text-sm">{{ message.text }}</div>
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

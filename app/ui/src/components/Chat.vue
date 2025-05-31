<script setup lang="ts">
  import { ref } from 'vue';

  const isOpen = ref(false);
  const messages = ref<{ text: string; isUser: boolean }[]>([]);
  const newMessage = ref('');

  const toggleChat = () => {
    isOpen.value = !isOpen.value;
  };

  const sendMessage = () => {
    if (!newMessage.value.trim()) return;

    messages.value.push({
      text: newMessage.value,
      isUser: true,
    });

    // Here you can add your chat logic to get response
    // For now, we'll just echo back
    setTimeout(() => {
      messages.value.push({
        text: `Echo: ${newMessage.value}`,
        isUser: false,
      });
    }, 1000);

    newMessage.value = '';
  };
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
      <div
        class="p-4 border-b flex justify-between items-center bg-indigo-600 text-white rounded-t-lg"
      >
        <h3 class="font-medium">Chat</h3>
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
            {{ new Date().toLocaleTimeString() }}
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t bg-gray-50">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
          />
          <button
            type="submit"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

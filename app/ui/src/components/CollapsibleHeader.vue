<script setup lang="ts">
  defineProps<{
    title: string;
    isExpanded: boolean;
  }>();

  defineEmits<{
    (e: 'toggle'): void;
  }>();
</script>

<template>
  <div
    class="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-between cursor-pointer"
    @click="$emit('toggle')"
  >
    <h3 class="text-lg font-medium text-white">{{ title }}</h3>
    <button
      class="text-white hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
      @click.stop="$emit('toggle')"
    >
      <svg
        class="h-5 w-5 transform transition-transform duration-200"
        :class="{ 'rotate-180': !isExpanded }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<template>
  <div class="toolbar">
    <div class="toolbar-group">
      <button @click="$emit('insert-text', '# ')" class="toolbar-button" title="Heading">
        #
      </button>
      <button @click="$emit('insert-text', '**')" class="toolbar-button" title="Bold">
        **
      </button>
      <button @click="$emit('insert-text', '*')" class="toolbar-button" title="Italic">
        *
      </button>
      <button @click="$emit('insert-text', '> ')" class="toolbar-button" title="Quote">
        >
      </button>
    </div>
    <div class="toolbar-group">
      <button @click="$emit('insert-text', '- ')" class="toolbar-button" title="Bullet List">
        -
      </button>
      <button @click="$emit('insert-text', '1. ')" class="toolbar-button" title="Numbered List">
        1.
      </button>
      <button @click="insertTable" class="toolbar-button" title="Table">
         table
      </button>
    </div>
    <div class="toolbar-group">
      <button @click="insertLink" class="toolbar-button" title="Link">
        link
      </button>
      <button @click="insertImage" class="toolbar-button" title="Image">
        Image
      </button>
      <button @click="insertCode" class="toolbar-button" title="Code">
        Code
      </button>
    </div>
    <div class="toolbar-group right">
      <button @click="$emit('toggle-preview')" class="toolbar-button" title="Preview">
        Eye
      </button>
      <button @click="$emit('toggle-fullscreen')" class="toolbar-button" title="Fullscreen">
        放大
      </button>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['insert-text', 'toggle-preview', 'toggle-fullscreen'])

const insertTable = () => {
  emit('insert-text', '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n')
}

const insertLink = () => {
  emit('insert-text', '[Link text](url)')
}

const insertImage = () => {
  emit('insert-text', '![Alt text](image-url)')
}

const insertCode = () => {
  emit('insert-text', '\n```\ncode block\n```\n')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.25rem;
  border-right: 1px solid #e2e8f0;
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-group.right {
  margin-left: auto;
}

.toolbar-button {
  padding: 0.375rem;
  border: none;
  background-color: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.toolbar-button:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.toolbar-button svg {
  width: 1rem;
  height: 1rem;
}
</style>
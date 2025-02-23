<template>
    <div v-html="htmlContent" class="markdown-output"></div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import MarkdownIt from 'markdown-it';
  
  // 默认配置下创建一个markdown-it实例
  const md = new MarkdownIt();
  
  export default defineComponent({
    name: 'MarkdownRenderer',
  
    props: {
      markdownContent: {
        type: String as PropType<string>,
        required: true
      }
    },
  
    computed: {
      // 将 markdown 内容转化为 HTML
      htmlContent(): string {
        return md.render(this.markdownContent);
      }
    }
  });
  </script>
  
  <style scoped>
  .markdown-output {
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  </style>
  
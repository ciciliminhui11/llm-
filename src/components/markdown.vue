<template>
  <div v-html="htmlContent" class="markdown-output"></div>
</template>

<script lang="ts">
import { defineComponent, PropType, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

});

export default defineComponent({
  name: 'MarkdownRenderer',

  props: {
    markdownContent: {
      type: String as PropType<string>,
      required: true
    }
  },

  computed: {
    htmlContent(): string {
      return md.render(this.markdownContent);
    }
  },

  mounted() {
    this.addCopyButtons();
  },

  updated() {
    nextTick(() => {
      this.addCopyButtons();
    });
  },

  methods: {
    addCopyButtons() {
      // 获取所有 pre 元素（代码块）
      const preElements = document.querySelectorAll('.markdown-output pre');
      
      // 遍历所有代码块
      preElements.forEach((pre) => {
        // 避免重复添加按钮
        if (pre.querySelector('.copy-button')) return;

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.addEventListener('click', this.handleCopy);
        
        // 添加定位容器
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.className = 'code-wrapper';
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(button);
      });
    },

    async handleCopy(event: Event) {
      const button = event.target as HTMLButtonElement;
      const pre = button.previousElementSibling as HTMLPreElement;
      const code = pre.querySelector('code')?.textContent || '';

      try {
        await navigator.clipboard.writeText(code);
        this.showFeedback(button, '已复制!');
      } catch (err) {
        this.showFeedback(button, '复制失败');
        console.error('复制失败:', err);
      }
    },

    showFeedback(button: HTMLButtonElement, text: string) {
      const originalText = button.textContent;
      button.textContent = text;
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    }
  }
});
</script>

<style>
.markdown-output {
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.copy-button {
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 2px 10px;
  font-size: 0.8em;
  background-color: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: #cbd5e1;
}

.code-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: auto;
  word-break: break-all;

}
</style>
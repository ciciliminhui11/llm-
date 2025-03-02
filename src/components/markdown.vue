<template>
  <div v-html="htmlContent" class="markdown-output"></div>
</template>

<script lang="ts">
import { defineComponent, PropType, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 使用暗色主题

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<div class="code-language">${lang}</div>` + hljs.highlight(lang, str).value;
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
    this.limitImageSize();
  },

  updated() {
    nextTick(() => {
      this.addCopyButtons();
      this.limitImageSize();
    });
  },

  methods: {
    addCopyButtons() {
      const preElements = document.querySelectorAll('.markdown-output pre');
      
      preElements.forEach((pre) => {
        if (pre.querySelector('.copy-button')) return;

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.addEventListener('click', this.handleCopy);
        
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
    },

    limitImageSize() {
      const images = document.querySelectorAll('.markdown-output img');
      images.forEach((img) => {
        (img as HTMLImageElement).style.maxWidth = '100%';
        (img as HTMLImageElement).style.maxHeight = '400px'; // 你可以根据需要调整这个值
        (img as HTMLImageElement).style.height = 'auto';
      });
    }
  }
});
</script>

<style>
/* 使用适合代码的字体 */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

.markdown-output {
  font-family: Arial, sans-serif;
}

.markdown-output pre {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  background-color: #2d2d2d; /* 暗色背景 */
  color: #f8f8f2; /* 浅色文字 */
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
  position: relative;
  margin: 16px 0;
}

.markdown-output code {
  font-family: inherit;
  background-color: transparent;
  padding: 0;
}

.code-language {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 12px;
  color: #999;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
}

.copy-button {
  position: absolute;
  right: 10px;
  top: 50px;
  padding: 4px 12px;
  font-size: 12px;
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background-color: #666;
}

.code-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: auto;
  word-break: break-all;
}

.markdown-output img {
  max-width: 100%;
  max-height: 400px; /* 你可以根据需要调整这个值 */
  height: auto;
  border-radius: 8px;
}
</style>
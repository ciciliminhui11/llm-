import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入 Element Plus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App);

//导入 Element Plus 的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用 Element Plus
app
  .use(store)
  .use(router)
  .use(ElementPlus) // 添加这行来引入 Element Plus
  .mount("#app");

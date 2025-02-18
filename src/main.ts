import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入 Element Plus 样式

const app = createApp(App);

// 使用 Element Plus
app
  .use(store)
  .use(router)
  .use(ElementPlus) // 添加这行来引入 Element Plus
  .mount("#app");

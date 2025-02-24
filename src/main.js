import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入 Element Plus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
var app = createApp(App);
//导入 Element Plus 的图标
for (var _i = 0, _a = Object.entries(ElementPlusIconsVue); _i < _a.length; _i++) {
    var _b = _a[_i], key = _b[0], component = _b[1];
    app.component(key, component);
}
// 使用 Element Plus
app
    .use(store)
    .use(router)
    .use(ElementPlus) // 添加这行来引入 Element Plus
    .mount("#app");
//# sourceMappingURL=main.js.map
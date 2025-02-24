import { createRouter, createWebHashHistory } from 'vue-router';
import home from '../views/home.vue';  // 导入 Home 页面
import chat_1 from '../views/TheSearch.vue';
import chat_2 from '../views/chat_2.vue';
import chat_3 from '../views/chat_3.vue';

const routes = [
  
  { path: '/',component: home },
  { path: '/chat_1', component: chat_1 },
  { path: '/chat_2', component: chat_2 },
  { path: '/chat_3', component: chat_3 },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;

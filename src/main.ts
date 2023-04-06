import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import "./styles/index.less";


async function bootstrap() {
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}

bootstrap();

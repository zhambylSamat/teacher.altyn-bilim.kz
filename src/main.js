import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'
import './components';
import vuetify from './plugins/vuetify';
import ApiService from '@/common/api.service.js';
import { SET_DEFAULT_ACTION, LOGOUT } from "@/store/actions.type.js";

Vue.config.productionTip = true;
ApiService.init();

store.watch(
  state => state.auth.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      if (router.history.current.name == 'login' || router.history.current.name == 'changePassword') {
        store.dispatch(SET_DEFAULT_ACTION).then(() => {
          router.go();
        });
      } else {
        router.push({ name: "login" }, () => {
          store.dispatch(SET_DEFAULT_ACTION);
        })
      }
    }
  }
);

ApiService.initInterceptors(store, LOGOUT);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

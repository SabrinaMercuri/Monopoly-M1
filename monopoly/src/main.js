import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

export const SocketInstance = socketio('http://localhost:3000');
//export const SocketInstance = socketio('https://monopolymiage.herokuapp.com/'); pour la mise en ligne 

Vue.use(new VueSocketIO({
  connection: SocketInstance
}))
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

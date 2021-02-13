import { createStore } from 'vuex'
import AuthModule from './AuthModule'
import FileModule from './FileModule'
import ChatModule from './ChatModule'
import ChatGroupModule from './ChatGroupModule'

// Create a new store instance.
export default createStore({
  state () {
    return {
        alert_message: null,
        show_tabbar: true
    }
  },
  modules: {
    auth: AuthModule,
    file: FileModule,
    chat: ChatModule,
    chatgroups: ChatGroupModule,
  },
  getters:{
    alert_message:state=>state.alert_message,
    show_tabbar:state=>state.show_tabbar,
  },
  mutations: {
    setAlertMessage(state,payload){
      state.alert_message = payload
    },
    setShowTabs(state,payload){
      state.show_tabbar = payload
    }
  }
})
import { createStore } from 'vuex'
import AuthModule from './AuthModule'
import FileModule from './FileModule'

// Create a new store instance.
export default createStore({
  state () {
    return {
        alert_message: null
    }
  },
  modules: {
    auth: AuthModule,
    file: FileModule
  },
  getters:{
    alert_message:state=>state.alert_message,
  },
  mutations: {
    setAlertMessage(state,payload){
      state.alert_message = payload
    }
  }
})
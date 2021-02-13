import firebase from "firebase";
import * as db from './db'
import * as dp from './handleDuplicates'
import moment from 'moment';

const ChatModule =  {
    // namespaced: true,
    state: () => ({
        contacts: [],
        friendRequests: [],
        friends: [],
        chat_messages: []
    }),
    mutations: {
        setContacts (state, payload) {
            state.contacts = dp.newContacts(payload, state)
        },
        setFriendRequests (state, payload) {
            state.friendRequests = dp.requestAndFriends(payload)
        },
        setFriends(state, payload) {
            state.friends = dp.requestAndFriends(payload);
        },
        setChatMessages(state,payload){
          state.chat_messages = payload
        }
    },
    actions: {
        getAllUsers({commit, dispatch, state}) {
            let promise = new Promise((resolve,reject)=>{
                firebase.database().ref('users').on('value', function(snapshot){
                //   console.log(snapshot.val())
                    commit('setContacts', snapshot.val())
                    resolve(snapshot.val())
                })
              })
            return promise
        },
        sendRequest({commit}, payload) {
            let promise = new Promise((resolve, reject) => {
                db.firerequest.child(payload.receipient).push({sender: payload.sender})
                .then(() => {
                    commit('setAlertMessage', 'request was sent')
                    resolve({success: true})
                })
                .catch(err => {
                    reject(err)
                    commit('setAlertMessage', err.message)
                })
            })
        },
        async getMyRequests({commit, dispatch}) {
            let users = await dispatch('getAllUsers')
            db.firerequest.child(firebase.auth().currentUser.uid)
            .on('value', snapshot => {
                // console.log(snapshot.val())
                let frd_request_id = _.map(snapshot.val(), "sender")
                let userdetails = []
                _.forEach(frd_request_id, uid => {
                    let user = _.find(users,["uid", uid])
                    userdetails.push(user)
                })
                commit('setFriendRequests', userdetails)
            })
        },
        confirmRequest({dispatch}, payload){
            let promise = new Promise((resolve, reject)=>{
              db.firefriends.child(firebase.auth().currentUser.uid)
              .push({uid: payload.uid})
              .then(()=>{
                db.firefriends.child(payload.uid)
                .push({uid: firebase.auth().currentUser.uid})
              })
              .then(()=>{
                dispatch('deleteRequest', payload).then(()=>{
                  resolve(true)
                })
              })
              .catch(err=>{
                reject(err)
              })
            })
            return promise
        },
        deleteRequest({}, payload){
            let promise = new Promise((resolve,reject)=>{
              db.firerequest.child(firebase.auth().currentUser.uid)
              .orderByChild('sender')
              .equalTo(payload.uid)
              .once('value', snapshot => {
                let userkey
                for(let key in snapshot.val()) userkey = key
                db.firerequest.child(firebase.auth().currentUser.uid)
                .child(userkey)
                .remove()
                .then(() => {
                  resolve(true)
                })
                .catch(err => {
                  reject(err)
                })
      
              }).catch(err  => {
                reject(err)
              })
            })
            return promise
        },
        async getMyFriends({commit,dispatch}){
            let users = await dispatch('getAllUsers')
            db.firefriends.child(firebase.auth().currentUser.uid)
            .on('value',snapshot=>{     
              // let frds_id = _.map(snapshot.val(),"uid")
              let friends = snapshot.val()
              let userdetails = []
              _.forEach(friends,(frd, key) => {
                let user = _.find(users,["uid",frd.uid])
                if (frd.latest_message) {
                  user.latest_message = frd.latest_message
                } else {
                  user.latest_message = ''
                }
                user.frd_key = key;
                userdetails.push(user)
      
              })
              console.log('user detais', userdetails)
              commit('setFriends', userdetails)
            })
        },
        async sendLatestMessage({},payload) {
          let user_id = firebase.auth().currentUser.uid
          let user_key = payload.userkey
          let frd_id = payload.friend.uid
          let frd_key = payload.friend.frd_key
          let latest_message = ''
          console.log('sendLatestMessage', payload.img)
          if (payload.img!=null) {
            latest_message = 'photo'
          } else {
            latest_message = payload.msg
          }
          try {
            await db.firefriends.child(user_id)
            .child(frd_key)
            .update({
              latest_message: latest_message
            })
            await db.firefriends.child(frd_id)
            .child(user_key)
            .update({
              latest_message:latest_message
            })
            
          } catch (error) {
            
          }
    
        },
        getUserKey({}, payload) {
          let promise = new Promise((resolve, reject)=>{
            let frd_id = payload.friend.uid
            db.firefriends.child(frd_id).orderByChild("uid")
            .equalTo(firebase.auth().currentUser.uid)
            .once('value', snapshot => {
              let userkey
              for(let key in snapshot.val()) userkey = key
              resolve(userkey)
    
            })
            .catch(err=>{
              reject(err)
            })
          })
          return promise
    
        },
        getChatMessages({commit}, payload){
          let current_user = firebase.auth().currentUser
          db.firechats.child(current_user.uid).child(payload.uid).on('value',snapshot=>{
            let messages = snapshot.val()
            _.forEach(messages, message=>{
              message.type = message.sentby == current_user.uid? 'sent' : 'received';
              message.name = message.sentby == current_user.uid? current_user.displayName : payload.name;
              message.avatar = message.sentby == current_user.uid? current_user.photoURL : payload.photo_url;
              message.date = moment(message.timestamp).format("MMMM Do dddd");
            })
            let groupedmessages = _.groupBy(messages, 'date')
            commit('setChatMessages', groupedmessages)
          })
        },
        async sendMessage({dispatch}, payload){
          let userkey = await dispatch('getUserKey',payload)
          let frd_info = payload
          frd_info.userkey = userkey
          dispatch('sendLatestMessage', frd_info)
          try {
            await db.firechats.child(firebase.auth().currentUser.uid)
            .child(payload.friend.uid)
            .push({
              sentby: firebase.auth().currentUser.uid,
              text: payload.msg,
              image: payload.img,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
    
            await db.firechats.child(payload.friend.uid)
            .child(firebase.auth().currentUser.uid)
            .push({
              sentby: firebase.auth().currentUser.uid,
              text: payload.msg,
              image: payload.img,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
          } catch (error) {
            console.log(error)
          }
         
        }
    },
    getters: { 
        getContacts(state) {
            return state.contacts
        },
        getFriendRequests(state) {
            return state.friendRequests
        },
        getFriends(state) {
            return state.friends
        },  
        chat_messages(state) {
          return state.chat_messages
        }

    }
  }
export default ChatModule
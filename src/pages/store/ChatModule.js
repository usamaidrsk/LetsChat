import firebase from "firebase";
import * as db from './db'
import * as dp from './handleDuplicates'

const ChatModule =  {
    // namespaced: true,
    state: () => ({
        contacts: [],
        friendRequests: [],
        friends: []
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
            var promise = new Promise((resolve, reject)=>{
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
        deleteRequest({},payload){
            var promise = new Promise((resolve,reject)=>{
              db.firerequest.child(firebase.auth().currentUser.uid)
              .orderByChild('sender')
              .equalTo(payload.uid)
              .once('value',snapshot=>{
                let userkey;
                for(var key in snapshot.val()) userkey = key
                db.firerequest.child(firebase.auth().currentUser.uid)
                .child(userkey)
                .remove()
                .then(()=>{
                  resolve(true)
                })
                .catch(err=>{
                  reject(err)
                })
      
              }).catch(err=>{
                reject(err)
              })
            })
            return promise
        },
        async getMyFriends({commit,dispatch}){
            var users = await dispatch('getAllUsers')
            db.firefriends.child(firebase.auth().currentUser.uid)
            .on('value',snapshot=>{     
              // var frds_id = _.map(snapshot.val(),"uid")
              var friends = snapshot.val()
              var userdetails = []
              _.forEach(friends,(frd, key) => {
                var user = _.find(users,["uid",frd.uid])
                if (frd.latest_message) {
                  user.latest_message = frd.latest_message
                } else {
                  user.latest_message = ''
                }
                user.frd_key = key;
                userdetails.push(user)
      
              })
            //   console.log('user detais', userdetails)
              commit('setFriends', userdetails)
            })
        },
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
    }
  }
export default ChatModule
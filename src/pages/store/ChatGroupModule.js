import firebase from "firebase";
import * as db from "./db";
import moment from "moment";
const ChatGroupModule = {
  state: {
    chat_groups: null,
    group_members: null,
    group_messages: null
  },
  getters: {
    chat_groups: state => state.chat_groups,
    group_members: state => state.group_members,
    group_messages: state => state.group_messages,
  },
  mutations: {
    setChatGroups(state, payload) {
      state.chat_groups = payload;
    },
    setGroupMembers(state, payload) {
      state.group_members = payload;
    },
    setGroupMessages(state, payload) {
      state.group_messages = payload;
    }
  },
  actions: {
    async sendLatestGroupMessage({dispatch},payload){
     let latest_message = payload.img == null? payload.message: 'image file'
      try {
        //find the owners
        let owner = ''
        await db.firegroups.child(firebase.auth().currentUser.uid)
        .child(payload.group_name)
        .once('value',snapshot =>{
          owner = snapshot.val().owner;
  
        })
        //send the msg to himself
        await db.firegroups.child(firebase.auth().currentUser.uid)
        .child(payload.group_name)
        .update({
          latest_message : latest_message
        })
        //if he is not owener, send to the owner
        if (firebase.auth().currentUser.uid != owner) {
          db.firegroups.child(owner).child(payload.group_name).update({
            latest_message : latest_message
          })
        }
        //send other members
        let members = await dispatch('getGroupMembers',payload.group_name)
        _.forEach(members, member=>{
          if(firebase.auth().currentUser.uid != member.uid){
            db.firegroups.child(member.uid)
            .child(payload.group_name)
            .update({
              latest_message : latest_message
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    getGroupMessages({commit},payload){
      let current_user = firebase.auth().currentUser;
      db.firegroups.child(firebase.auth().currentUser.uid).child(payload).child('msgboard').on('value',snapshot=>{
        let messages = snapshot.val()
        // console.log('messages',messages)
        let group_messages = [];
        _.forEach(messages, message=>{
          message.type = message.sentby == current_user.uid? "sent": "received";
          // message.name = message.sentby = current_user.uid? current_user.displayName: 'friend name';
          message.date = moment(message.timestamp).format("MMMM Do dddd");
          group_messages.push(message)
        })
        // console.log('group messages',group_messages)
        commit('setGroupMessages',group_messages)
      },err=>{
        console.log(err)
      })
    },
    async sendGroupMessage({dispatch},payload){
      // console.log('send group message')
      try {
        //find the owners
        let owner = ''
        await db.firegroups.child(firebase.auth().currentUser.uid)
        .child(payload.group_name)
        .once('value',snapshot =>{
          owner = snapshot.val().owner;
  
        })
        //send the msg to himself
        await db.firegroups.child(firebase.auth().currentUser.uid)
        .child(payload.group_name)
        .child('msgboard')
        .push({
          sentby: firebase.auth().currentUser.uid,
          displayName: firebase.auth().currentUser.displayName,
          avatar: firebase.auth().currentUser.photoURL,
          image: payload.img,
          text: payload.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        //if he is not owener, send to the owner
        if (firebase.auth().currentUser.uid != owner) {
          db.firegroups.child(owner).child(payload.group_name).child('msgboard') .push({
            sentby: firebase.auth().currentUser.uid,
            displayName: firebase.auth().currentUser.displayName,
            avatar: firebase.auth().currentUser.photoURL,
            image: payload.img,
            text: payload.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
        }
        //send other members
        let members = await dispatch('getGroupMembers',payload.group_name)
        _.forEach(members, member=>{
          if(firebase.auth().currentUser.uid != member.uid){
            db.firegroups.child(member.uid)
            .child(payload.group_name)
            .child('msgboard')
            .push({
              sentby: firebase.auth().currentUser.uid,
              displayName: firebase.auth().currentUser.displayName,
              avatar: firebase.auth().currentUser.photoURL,
              image: payload.img,
              text: payload.message,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async leaveGroup({},payload){
      try {
         //find the owner
      let owner = '';
      await db.firegroups.child(firebase.auth().currentUser.uid)
      .child(payload.group_name)
      .once('value',snapshot =>{
        owner = snapshot.val().owner;

      })
    
        //find the member
        let member_ref = await db.firegroups
          .child(owner)
          .child(payload.group_name)
          .child("members");
        member_ref
          .orderByChild("uid")
          .equalTo(firebase.auth().currentUser.uid)
          .once("value", snapshot => {
            let memberkey;
            // console.log(snapshot.val())
            for (let key in snapshot.val()) memberkey = key;
            //remove the member
            // console.log('memberkey',memberkey)
            member_ref.child(memberkey).remove();
          });

        //remove the group that belong to the member before
        await db.firegroups
          .child(firebase.auth().currentUser.uid)
          .child(payload.group_name)
          .remove();
        await dispatch("getGroupMembers", payload.group_name);
      
      } catch (error) {
        console.log(error)
      }
     
    },
    async removeMember({ dispatch }, payload) {
      // console.log('remove member',payload)
      try {
        //find the member
        let member_ref = await db.firegroups
          .child(firebase.auth().currentUser.uid)
          .child(payload.group_name)
          .child("members");
        member_ref
          .orderByChild("uid")
          .equalTo(payload.member.uid)
          .once("value", snapshot => {
            let memberkey;
            // console.log(snapshot.val())
            for (let key in snapshot.val()) memberkey = key;
            //remove the member
            // console.log('memberkey',memberkey)
            member_ref.child(memberkey).remove();
          });

        //remove the group that belong to the member before
        await db.firegroups
          .child(payload.member.uid)
          .child(payload.group_name)
          .remove();
        await dispatch("getGroupMembers", payload.group_name);
      } catch (error) {
        console.log(error);
      }
    },
    async getGroupMembers({ commit }, group_name) {
      let owner = '';
      await db.firegroups.child(firebase.auth().currentUser.uid)
      .child(group_name)
      .once('value',snapshot =>{
        owner = snapshot.val().owner;
      })
      let promise = new Promise((resolve,reject)=>{
        db.firegroups
        .child(owner)
        .child(group_name)
        .once("value", snapshot => {
          let members = snapshot.val().members;
          let groupmembers = [];
          for (let key in members) {
            groupmembers.push(members[key]);
          }
          resolve(members)
          commit("setGroupMembers", groupmembers);
        },err=>{
          reject(err)
        });
      })
      return promise
      
    },
    async addMember({ dispatch }, payload) {
      try {
        await db.firegroups
          .child(firebase.auth().currentUser.uid)
          .child(payload.group_name)
          .child("members")
          .push(payload.newmember);

        let url = await dispatch("getGroupImage", payload.group_name);
        await db.firegroups
          .child(payload.newmember.uid)
          .child(payload.group_name)
          .set({
            group_pic: url,
            msgboard: "",
            owner: firebase.auth().currentUser.uid
          });
        dispatch("getGroupMembers", payload.group_name);
      } catch (error) {
        console.log(error);
      }
    },
    getGroupImage({}, group_name) {
      let promise = new Promise((resolve, reject) => {
        db.firegroups
          .child(firebase.auth().currentUser.uid)
          .child(group_name)
          .once("value", snapshot => {
            let group_pic = snapshot.val().group_pic;
            resolve(group_pic);
          })
          .catch(err => {
            reject(err);
          });
      });
      return promise;
    },
    createGroup({}, group) {
      let promise = new Promise((resolve, reject) => {
        db.firegroups
          .child(firebase.auth().currentUser.uid)
          .child(group.name)
          .set({
            group_pic: group.pic,
            msgboard: "",
            owner: firebase.auth().currentUser.uid
          })
          .then(data => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          });
      });
      return promise;
    },
    getMyGroups({ commit }) {
      db.firegroups
        .child(firebase.auth().currentUser.uid)
        .once("value", snapshot => {
          let mygroups = [];
          if (snapshot.val() != null) {
            let groups = snapshot.val();
            for (let key in groups) {
              let group = {
                name: key,
                pic: groups[key].group_pic,
                owner: groups[key].owner
              };
              mygroups.push(group);
            }
          }
          commit("setChatGroups", mygroups);
        });
    }
  }
};
export default ChatGroupModule;

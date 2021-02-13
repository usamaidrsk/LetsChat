import firebase from 'firebase'
export let firerequest = firebase.database().ref('/requests')
export let firefriends = firebase.database().ref('/friends');
export let firechats = firebase.database().ref('/chats');
export let firegroups = firebase.database().ref('/groups');

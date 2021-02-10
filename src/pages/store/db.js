import firebase from 'firebase'
export let firerequest = firebase.database().ref('/requests')
export let firefriends = firebase.database().ref('/friends');

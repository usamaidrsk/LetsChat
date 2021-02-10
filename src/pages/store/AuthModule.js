import firebase from "firebase";

const AuthModule =  {
    // namespaced: true,
    state: () => ({
        signed_up: false,
        signedIn: false,
        showResendEmail: false,
        photoUrl: '',
        displayName: ''
    }),
    mutations: {
        setSignedUp (state, payload) {
            state.signed_up = payload
        },
        setSignedIn (state, payload) {
            state.signedIn = payload
        },
        setShowResendEmail (state, payload) {
            state.showResendEmail = payload
        },
        setPhotoUrl (state, payload) {
            state.photoUrl = payload
        },
        setDisplayName (state, payload) {
            state.displayName = payload
        }
    },
    actions: {
        signIn({commit}, payload) {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                // loggged In
                firebase.auth().onAuthStateChanged(function(user) {
                    if(user != null){
                      if ( user.emailVerified) {
                        commit('setAlertMessage', `Welcome ${user.displayName}`)
                        commit('setShowResendEmail', false)
                        commit('setSignedIn', true)
                        commit('setDisplayName', user.displayName)
                        commit('setPhotoUrl', user.photoURL)
                      } else {
                        // No user is signed in.
                        commit('setShowResendEmail', true)
                        commit('setSignedIn', false)
                        commit('setAlertMessage', 'Please verify with your email')
                      }
                    } else {
                        return
                    }
                })
            }).catch(error => {
                commit('setAlertMessage', error.message)
            })
        },
        signOut({commit}) {
            firebase.auth().signOut().then(() => {
                commit('setSignedIn', false)
                commit('setAlertMessage', 'signed out successfully')
            })
        },
        signUp({commit, dispatch}, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(data => {
                firebase.database().ref('users').child(data.user.uid).set({
                    uid: data.user.uid,
                    name: payload.name,
                    email: payload.email,
                    emailVerified: false,
                    photo_url: payload.photoUrl
                })
                let newUser = data.user
                newUser.updateProfile({
                    displayName: payload.name,
                    photoURL: payload.photoUrl
                })
                .then(() => {
                    console.log("updated profle")
                    dispatch('sendVerificationEmail')
                    commit('setSignedUp', true)
                }).catch(error => {
                    commit('setAlertMessage', error.message)
                })
            }).catch(error => {
                commit('setAlertMessage', error.message)
            })
        },
        sendVerificationEmail({commit}) {
            let user = firebase.auth().currentUser;
            user.sendEmailVerification().then(() => {
                // Email sent.
                commit('setAlertMessage', `A verification email has been sent to ${user.email}`)
            }).catch(function(error) {
                // An error happened.
                commit('setAlertMessage', error.message)
            });
        }
    },
    getters: { 
        getSignedUp (state) {
            return state.signed_up
        },
        getSignedIn (state) {
            return state.signedIn
        },
        getShowResendEmail (state) {
            return state.showResendEmail
        },
        getPhotoUrl (state) {
            return state.photoUrl
        },
        getDisplayName (state) {
            return state.displayName
        }
    }
  }
export default AuthModule
<template>
<f7-page name="editprofile">
    <f7-navbar title="Edit Profile" ></f7-navbar>
    <div class="wrapper">
        <img class="image--cover" :src="imageUrl" alt="" @click="launchFilePicker">
    </div>

        <f7-list no-hairlines-md>
            <f7-list-input :value="displayName" @input="displayName=$event.target.value" label="Name" type="text" placeholder="Your name" clear-button>

            </f7-list-input>

        </f7-list>
        <f7-block>
            <f7-button outline @click="updateProfile">Update Profile</f7-button>
            <input type="file" ref="file" style="display:none;" @change="onFilePicked">
           
        </f7-block>
</f7-page>
</template>

<script>
import firebase from 'firebase'
import {
    mixin
} from '../../js/mixin'
export default {
    mixins: [mixin],
    data() {
        return {
            name: null,
            email: null,
            password: null,

        }
    },
    computed: {
        displayName: {
            get: function () {
                return this.$store.getters.getDisplayName
            },
            set: function (newValue) {
                this.$store.commit('setDisplayName', newValue)
            }
        },
        imageUrl() {
            return this.$store.getters.getImageUrl
        },
        files() {
            return this.$store.getters.getFiles
        },
        photoUrl() {
            return this.$store.getters.getPhotoUrl
        }

    },
    watch: {

    },

    methods: {
        launchFilePicker() {
            this.$refs.file.click()

        },
        onFilePicked() {
            //read the image file
            this.$store.dispatch('readFile', 'setImageUrl')
        },
        updateProfile(){
            const self = this
            if (self.files) {
                var user = firebase.auth().currentUser;
                if (this.photoUrl != null) {
                    var storage = firebase.storage();
                    var httpReference = storage.refFromURL(this.photoUrl);
                    httpReference.delete().then(()=>{
                        // delete if exists previous photoURL
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                self.$store.dispatch('uploadFile', 'profile/').then(url => {
                   user.updateProfile({
                       displayName: self.displayName,
                       photoURL: url
                   }).then(function(){
                       self.$store.commit('setPhotoUrl', user.photoURL);
                       self.$store.commit('setDisplayName', user.displayName);
                       firebase.database().ref('users/' + user.uid).update({
                           photo_url: user.photoURL,
                           name: user.displayName
                       })
                       self.$store.commit('setAlertMessage', 'Profile was updated successfully')

                   }).catch(err=>{
                        console.log(err)
                        self.$store.commit('setAlertMessage', err.message)
                   })
                })
            } else {
                user.updateProfile({
                    displayName: self.displayName,
                }).then(function(){
                    self.$store.commit('setDisplayName', user.displayName)
                })
            }

        
        }

    },
    created() {
        if (this.photoUrl != null) {
            this.$store.commit('setImageUrl', this.photoUrl)
        }
    }
}
</script>

<style scoped>
.wrapper {
    text-align: center;
}

.image--cover {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 20px;
    object-fit: cover;
    object-position: center;
}
</style>

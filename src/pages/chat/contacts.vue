<template>
  <f7-page name="contacts">
        <f7-navbar title="Contacts" back-link="Back"></f7-navbar>
        <f7-list >
            <f7-list-item swipeout v-for="(contact, index) in contacts" :key="index" :title="contact.name" v-show="contact.uid !== uid">
                <img class="small-avatar" :src="contact.photo_url" />
                <f7-swipeout-actions right>
                    <f7-swipeout-button color="green" @click="addFrnd(contact)">Add</f7-swipeout-button>
                </f7-swipeout-actions>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>
<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'
export default {
    data () {
        return {
            uid: null
        }
    },
    computed: {
        contacts() {
            return this.$store.getters.getContacts
        }
    },
    methods: {
        addFrnd(frnd) {
            let request = {}
            request.sender = firebase.auth().currentUser.uid
            request.receipient = frnd.uid
            this.$store.dispatch('sendRequest', request)
        }
    },
    created() {
        this.$store.dispatch('getAllUsers')
        this.uid = firebase.auth().currentUser.uid
    }
}
</script>
<style scoped>
.small-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
}
</style>
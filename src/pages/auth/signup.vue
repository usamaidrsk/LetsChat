<template>
  <f7-page name="signup">
    <f7-navbar title="Sign Up" back-link="Back"></f7-navbar>
    <div class="wrapper">
        <img class="image--cover" :src="imageUrl" alt="" srcset="" @click="launchFilePicker()">
    </div>
    <f7-list no-hairlines-md>
    <f7-list-input
        label="Name"
        :value="name"
        @input="name = $event.target.value"
        type="text"
        placeholder="Your name"
        clear-button
    >
    </f7-list-input>

    <f7-list-input
        label="E-mail"
        :value="email"
        @input="email = $event.target.value"
        type="email"
        placeholder="Your e-mail"
        clear-button
    >
    </f7-list-input>

    <f7-list-input
        label="Password"
        :value="password"
        @input="password = $event.target.value"
        type="password"
        placeholder="Your password"
        clear-button
    >
    </f7-list-input>

    <f7-block>
        <f7-button outline @click="signUp()">Sign Up</f7-button><br>
        <input type="file" ref="file" style="display: none;" @change="onFilePicked()"/>
    </f7-block>
    </f7-list>
  </f7-page>
</template>
<script>
import { mapGetters } from 'vuex'
import { mixin } from '../../js/mixin'
export default {
    mixins: [mixin],
    props: {
      f7route: Object,
      f7router: Object,
    },
    data () {
        return {
            toastBottom: '',
            name: null,
            email: null,
            password: null,
        }
    },
    computed: {
        ...mapGetters({
            imageUrl: 'getImageUrl',
            files: 'getFiles',
            signedUp: 'getSignedUp'
        })
    },
    watch: {
        signedUp (value) {
            if (value === true) {
                setTimeout(() => {
                    this.f7router.navigate('/signin/')
                }, 3000)
            }
        }
    },
    created () {
        this.$store.commit('setSignedUp', false)
        const url = "https://firebasestorage.googleapis.com/v0/b/chatapp-39b2f.appspot.com/o/profile%2Fav3.png?alt=media&token=f47a3800-26f8-4a4d-87d3-4f0cc039d4dc"
        this.$store.commit('setImageUrl', url)
    },
    methods: {
        launchFilePicker () {
            this.$refs.file.click()
        },
        onFilePicked () {
            this.$store.dispatch('readFile', 'setImageUrl')
        },
        signUp () {
            const self = this
            let payload = {}
            payload.name = this.name
            payload.email = this.email
            payload.password = this.password
            payload.photoUrl = this.imageUrl
            if (self.files) {
                self.$store.dispatch('uploadFile').then( url => {
                    payload.photoUrl = url
                    self.$store.dispatch('signUp', payload)   
                })
            } else {
                this.$store.dispatch('signUp', payload)   
            }
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
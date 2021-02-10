<template>
  <f7-page name="signin">
    <f7-navbar title="Sign In"></f7-navbar>
    <f7-list no-hairlines-md>
    <f7-list-input
        :value="email"
        @input="email = $event.target.value"
        label="E-mail"
        type="email"
        placeholder="Your e-mail"
        clear-button
    >
    </f7-list-input>
    <f7-list-input
        :value="password"
        @input="password = $event.target.value"
        label="Password"
        type="password"
        placeholder="Your password"
        clear-button
    >
    </f7-list-input>
    <f7-block>
        <f7-button outline @click="signIn()">Sign In</f7-button><br>
        <div style="text-align: center;">
            <f7-link @click="resendEmail()" :color="color(timeLeft)" v-if="showResendEmail">Resend confirmation email<span v-if='timeLeft > 0'>&nbsp;{{timeLeft}}</span></f7-link><br>
            <f7-link href="/signup/">Don't have an account? Sign Up</f7-link><br>
            <f7-link @click="forgotPassword()">Forgot Password</f7-link>
        </div>
    </f7-block>
    </f7-list>
  </f7-page>
</template>
<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            email: null,
            password: null,
            timeLeft: -1
        }
    },
    computed: {
        ...mapGetters({
            showResendEmail: 'getShowResendEmail'
        })
    },
    created () {
        this.$store.commit('setSignedIn', false)
        this.$store.commit('setShowResendEmail', false)
    },
    methods: {
        signIn () {
            let payload = {}
            payload.email = this.email
            payload.password = this.password
            this.$store.dispatch('signIn', payload)
        },
        forgotPassword() {
            const self = this
            var auth = firebase.auth();
            if (this.email != null) {
                auth.sendPasswordResetEmail(this.email).then(function () {
                    // Email sent.
                    self.$store.commit('setAlertMessage', 'A reset email has been sent')
                }).catch(function (error) {
                    self.$store.commit('setAlertMessage', error.message)
                });
            } else {
                self.$store.commit('setAlertMessage', 'Please enter your email')
            }
        },
        countDown() {
            const self = this
            self.timeLeft = 20
            let timer = setInterval( function() {
                self.timeLeft -= 1
                if (self.timeLeft <= 0) {
                    clearInterval(timer)
                }
            }, 1000)
        },
        color(timeLeft) {
            if (timeLeft <= 0) {
                return '#007aff'
            } else {
                return 'gray'
            }
        },
        resendEmail() {
            const self = this
            if (self.timeLeft <= 0) {
                self.$store.dispatch('sendVerificationEmail')
                self.countDown()
            }
        }
    }
}
</script>

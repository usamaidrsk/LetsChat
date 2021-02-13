<template>
  <f7-page name="home" @page:beforein="initHome">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
        <f7-nav-left>
            <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>LetsChat </f7-nav-title>
        <f7-nav-right>
            <f7-link href="/requests/">
                <f7-icon f7="person_2">
                    <f7-badge color="red" v-if="Object.keys(friend_requests).length>0">{{Object.keys(friend_requests).length}}</f7-badge>
                </f7-icon>
            </f7-link>
            <f7-link icon-f7="plus" href="/contacts/">

            </f7-link>
        </f7-nav-right>
        <f7-nav-title-large sliding>LetsChat </f7-nav-title-large>
    </f7-navbar>

    <f7-list media-list>
         <f7-list-item v-for="(frd, index) in friends" :key="index" :title="frd.name"  @click="gotoChat(frd)">
            <img class="small-avatar" :src="frd.photo_url" />
        </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
      f7route: Object,
      f7router: Object,
    },
    methods: {
        gotoChat(frd) {
            var frd_string = JSON.stringify(frd)
            this.f7router.navigate('/chat/' + encodeURIComponent(frd_string))
        },
        initHome() {
            this.$store.commit('setShowTabs', true)
        }
    },
    computed: {
      ...mapGetters({ 
        friend_requests: 'getFriendRequests',
        friends: 'getFriends'
      })
    },
    created() {

        this.$store.dispatch('getMyRequests')
        this.$store.dispatch('getMyFriends')

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
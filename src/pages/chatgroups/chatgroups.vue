<template>
<f7-page name="chatgroups" @page:beforein="init">
    <f7-navbar title="Chat groups"></f7-navbar>
    <f7-block>
        <f7-link href="/newgroup/">Create Group</f7-link>
        <f7-list media-list>
            <f7-list-item v-for="(group, index) in chat_groups" :key="index" :title="group.name" :text="group.latest_message" @click="gotoGroup(group)">
                <img class="small-avatar" :src="group.pic" />

            </f7-list-item>

        </f7-list>
    </f7-block>
</f7-page>
</template>

<script>

export default {
    props: {
      f7route: Object,
      f7router: Object,
    },
    methods: {
        gotoGroup(group) {
          var groupstring = JSON.stringify(group)
          this.f7router.navigate('/chatgroup/'+encodeURIComponent(groupstring))
        },
        init(){
          this.$store.commit('setShowTabs', true)
           this.$store.dispatch('getMyGroups')
        }
    },
    computed: {
        chat_groups() {
            return this.$store.getters.chat_groups
        },
    },
    created() {
       this.init()
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

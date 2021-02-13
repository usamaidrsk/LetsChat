<template>
<f7-page name="addmembers">
    <f7-navbar title="Add Members" back-link="Back"></f7-navbar>
    <f7-block-title>Add members</f7-block-title>
     <f7-block>
        <f7-list media-list>
            <f7-list-item swipeout v-for="(member, index) in p_members" :key="index" :title="member.name">
                <img class="small-avatar"  :src="member.photo_url" />
                <f7-swipeout-actions right>
                    <f7-swipeout-button color="green" @click="add(member)">Add</f7-swipeout-button>
                </f7-swipeout-actions>
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
    data() {
        return {
            group_name: null
        }
    },
    computed: {
        p_members() {
            const self = this
            var friends = [...this.$store.getters.getFriends]
            _.forEach(self.group_members, function(member){
                const index = _.findIndex(friends,member)
                friends.splice(index,1)
            })
            return friends
        },
        group_members(){
            return this.$store.getters.group_members
        }
    },
    methods:{
        add(member){
            var payload = {}
            payload.newmember = member
            payload.group_name = this.group_name
            this.$store.dispatch('addMember',payload)

        }
    },
    async created() {
        this.group_name = this.f7route.params.group_name
        this.$store.dispatch('getGroupMembers',this.group_name)
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

<template>
<f7-page name="groupinfo">
    <f7-navbar title="groupinfo" back-link="Back"></f7-navbar>
    <f7-block-title v-if="group_members.length>0">{{group_members.length}} member{{group_members.length>1?'s':''}}</f7-block-title>
    <f7-block-title v-else>No members yet</f7-block-title>
    <f7-block>
        <f7-list media-list>
            <f7-list-item swipeout v-for="(member, index) in group_members" :key="index" :title="member.name">
                <img class="small-avatar"  :src="member.photo_url" />

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
        group_members() {
            return this.$store.getters.group_members
        }
    },
    created() {
        this.group_name = this.f7route.params.group_name
        this.$store.dispatch('getGroupMembers', this.group_name)
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

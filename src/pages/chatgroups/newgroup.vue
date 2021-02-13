<template>
<f7-page name="newgroup">
    <f7-navbar title="New group" back-link="Back"></f7-navbar>
    <f7-block-title>New group</f7-block-title>
    <f7-block>
        <div class="wrapper">
            <img class="image--cover" :src="group_image_url" alt="" @click="launchFilePicker">
        </div>
        <f7-list no-hairlines-md>
            <f7-list-input :value="group_name" @input="group_name=$event.target.value" label="Group Name" type="text" placeholder="Your group name" clear-button>
            </f7-list-input>
        </f7-list>
        <f7-button fill @click="createGroup">Create New Group</f7-button>
        <input type="file" ref="file" style="display:none;" @change="onFilePicked">

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
            group_name: 'New Group'
        }
    },
    computed: {
        group_image_url() {
            return this.$store.getters.group_image_url
        },
        files() {
            return this.$store.getters.files
        },
        groupCreated() {
            return this.$store.getters.groupCreated
        }
    },
    watch: {
        groupCreated (value) {
            if (value === true) {
                setTimeout(() => {
                    this.f7router.navigate('/chatgroups/')
                }, 3000)
            }
        }
    },
    methods: {
        async createGroup(){
            var group = {}
            group.name = this.group_name
            group.pic = this.group_image_url
            // console.log(group)
            // if(this.files) ...
            if(this.files) group.pic = await this.$store.dispatch('uploadFile','group_profile/')
            this.$store.dispatch('createGroup', group)
        },
        launchFilePicker() {
            this.$refs.file.click()
        },
        onFilePicked() {
            this.$store.dispatch('readFile', 'setGroupImageURL')
        }
    },
    created() {
        var url = 'https://firebasestorage.googleapis.com/v0/b/whatchat-4c8cf.appspot.com/o/group_profile%2Fgroup%20icon.jpg?alt=media&token=2a2ef2b7-31fb-4677-a1d6-664c48791542'
        this.$store.commit('setGroupImageURL', url)
        this.$store.commit('setGroupCreated', true)
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

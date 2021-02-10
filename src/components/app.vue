<template>
  <f7-app v-bind="f7params" >

  <!-- Left panel with cover effect-->
  <f7-panel left cover theme-dark>
    <f7-view>
      <f7-page>
         <div class="wrapper">
            <img class="image--cover" :src="photoUrl" alt />
          </div>
          <f7-block style="text-align:center;">{{displayName.toUpperCase()}}</f7-block>
        <f7-list>
          <f7-list-item panel-close title="Sign In" link="/signin/" view=".view-main"/>
          <f7-list-item panel-close title="Sign Out" @click="signOut()" view=".view-main"/>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-panel>

  <!-- Views/Tabs container -->
  <f7-views tabs class="safe-areas" v-if='signedIn'>
    <!-- Tabbar for switching views-tabs -->
    <f7-toolbar tabbar labels bottom>
      <f7-link tab-link="#view-home" tab-link-active icon-ios="f7:house_fill" icon-aurora="f7:house_fill" icon-md="material:home" text="Home"></f7-link>
      <f7-link tab-link="#view-catalog" icon-ios="f7:square_list_fill" icon-aurora="f7:square_list_fill" icon-md="material:view_list" text="Catalog"></f7-link>
      <f7-link tab-link="#view-profile" icon-ios="f7:gear" icon-aurora="f7:gear" icon-md="material:settings" text="Profile"></f7-link>
    </f7-toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
    <f7-view id="view-home" main tab tab-active url="/"></f7-view>

    <!-- Catalog View -->
    <f7-view id="view-catalog" name="catalog" tab url="/catalog/"></f7-view>

    <!-- Settings View -->
    <f7-view id="view-profile" name="profile" tab url="/editprofile/"></f7-view>

  </f7-views>
  <f7-view v-if="!signedIn" url="/signin/" :main='true'></f7-view>
  </f7-app>
</template>
<script>
  import { ref, onMounted } from 'vue';
  import { f7, f7ready } from 'framework7-vue';
  import routes from '../js/routes.js';
  import store from '../js/store';
  import { mixin } from "../js/mixin";
  import firebase from 'firebase';
  // require('dotenv')

  // var firebaseConfig = {
  //   apiKey: process.env.API_KEY,
  //   authDomain: process.env.AUTH_DOMAIN,
  //   projectId: process.env.PROJECT_ID,
  //   storageBucket: process.env.STORAGE_BUCKET,
  //   messagingSenderId: process.env.MESSAGE_SENDER_ID,
  //   appId: process.env.APP_ID,
  //   measurementId: process.env.MESUREMENT_ID,
  // };
  var firebaseConfig = {
    apiKey: "AIzaSyAJPkYVQN-vWJIvpJFxRn07-yOquXLk7iY",
    authDomain: "chatapp-39b2f.firebaseapp.com",
    databaseURL: "https://chatapp-39b2f-default-rtdb.firebaseio.com",
    projectId: "chatapp-39b2f",
    storageBucket: "chatapp-39b2f.appspot.com",
    messagingSenderId: "508956016145",
    appId: "1:508956016145:web:9c7795c521503611d5bbb0",
    measurementId: "G-FDSKP1QXBW"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default {
    mixins: [mixin],
    props: {
      f7route: Object,
      f7router: Object,
    },
    data () {
      return {
        f7params: {
          name: 'LetsChat', // App name
          theme: 'auto', // Automatic theme detection
          // App store
          store: store,
          // App routes
          routes: routes,
        },
        username: '',
        password: '',

      }
    },
    computed: {
      signedIn () {
        return this.$store.getters.getSignedIn
      },
      photoUrl () {
        return this.$store.getters.getPhotoUrl
      },
      displayName () {
        return this.$store.getters.getDisplayName
      }
    },
    methods: {
      alertLoginData() {
        f7.dialog.alert('Username: ' + username.value + '<br>Password: ' + password.value, () => {
          f7.loginScreen.close();
        });
      },
      signOut() {
        this.$store.dispatch('signOut')
        f7.panel.close()
      },
      openProfile()  {
        f7router.navigate('/editprofile/')
      }
    },
     mounted() {
      f7ready(f7 => {
        // 
        // console.log(this.photoUrl)
      });
    }
  }
</script>
<style scoped>
.wrapper {
  text-align: center;
}

.image--cover {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 20px;
  object-fit: cover;
  object-position: center;
}
</style>
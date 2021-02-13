
import HomePage from '../pages/home.vue';
import NotFoundPage from '../pages/404.vue';
import SignInPage from '../pages/auth/signin.vue';
import SignUpPage from '../pages/auth/signup.vue';
import EditProfile from '../pages/auth/editProfile.vue';
import Contacts from '../pages/chat/contacts.vue';
import Requests from '../pages/chat/requests.vue';
import ChatPage from '../pages/chat/chat.vue';
import ChatGroups from '../pages/chatgroups/chatgroups.vue';
import ChatGroup from '../pages/chatgroups/chatgroup.vue';
import NewGroup from '../pages/chatgroups/newgroup.vue';
import AddMembers from '../pages/chatgroups/addmembers.vue';
import GroupInfo from '../pages/chatgroups/groupinfo.vue';
import GroupMembers from '../pages/chatgroups/groupmembers.vue';


var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/signin/',
    component: SignInPage,
  },
  {
    path: '/signup/',
    component: SignUpPage,
  },
  {
    path: '/editprofile/',
    component: EditProfile,
  },
  {
    path: '/contacts/',
    component: Contacts,
  },
  {
    path: '/requests/',
    component: Requests,
  },
  {
    path: '/chat/:frd',
    component: ChatPage,
  },
  {
    path: '/chatgroups/',
    component: ChatGroups,
  },
  {
    path: '/chatgroup/:group',
    component: ChatGroup,
  },
  {
    path: '/newgroup/',
    component: NewGroup,
  },
  {
    path: '/addmembers/:group_name',
    component: AddMembers,
  },
  {
    path: '/groupmembers/:group_name',
    component: GroupMembers,
  },
  {
    path: '/groupinfo/:group_name',
    component: GroupInfo,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;

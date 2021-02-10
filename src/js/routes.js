
import HomePage from '../pages/home.vue';
import CatalogPage from '../pages/catalog.vue';
import ProductPage from '../pages/product.vue';
import NotFoundPage from '../pages/404.vue';
import SignInPage from '../pages/auth/signin.vue';
import SignUpPage from '../pages/auth/signup.vue';
import EditProfile from '../pages/auth/editProfile.vue';
import Contacts from '../pages/chat/contacts.vue';
import Requests from '../pages/chat/requests.vue';


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
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;

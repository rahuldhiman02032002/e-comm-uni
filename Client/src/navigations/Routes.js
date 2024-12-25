import About from "../containers/about/About.js";
import Department from "../containers/admin/department/Department.js";
import Product from "../containers/admin/product/Product.js";
import University from "../containers/admin/university/University.js";
import Contact from "../containers/contact/Contact.js";
import Login from "../containers/login/Login.js";
import Register from "../containers/register/Register.js";
import Support from "../containers/support/Support.js";
import Cart from "../containers/user/addCart/Cart.js";
import UserDepartment from "../containers/user/department/UserDepartment.js";
import Home from "../containers/user/home/Home.js";
import UserProduct from "../containers/user/product/UserProduct.js";
import ProductDetails from "../containers/user/productDetails/ProductDetails.js";
import StripeCheckout from "../containers/user/stripeCheckout/StripeCheckout.js";
import Summary from "../containers/user/summary/Summary.js";

const ROUTES = {
  about: {
    name: "/about",
    component: <About />,
  },
  contact: {
    name: "/contact",
    component: <Contact />,
  },
  support: {
    name: "/support",
    component: <Support />,
  },
  register: {
    name: "/register",
    component: <Register />,
  },
  login: {
    name: "/login",
    component: <Login />,
  },
  //Admin
  universityAdmin: {
    name: "/universityAdmin",
    component: <University />,
  },
  departmentAdmin: {
    name: "/departmentAdmin",
    component: <Department />,
  },
  productAdmin: {
    name: "/productAdmin",
    component: <Product />,
  },
  //User
  home: {
    name: "/",
    component: <Home />,
  },
  departmentUser: {
    name: "/departmentUser",
    component: <UserDepartment />,
  },
  productUser: {
    name: "/productUser",
    component: <UserProduct />,
  },
  productDetail: {
    name: "/productDetail",
    component: <ProductDetails />,
  },
  addCart: {
    name: "/cart",
    component: <Cart />,
  },
  summary: {
    name: "/summary",
    component: <Summary />,
  },
  stripeCheckout: {
    name: "/stripeCheckout",
    component: <StripeCheckout />,
  },
};
export default ROUTES;

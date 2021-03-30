import { useParams } from 'react-router-dom';
import { Main, Product, Admin, ProductPage, Login, ResetPassword } from './pages';
import axios from 'axios';

const rootPath = process.env.PUBLIC_URL;

var routes = [
  {
    path: `${rootPath}/`,
    component: Main,
    exact: true,
    breadcrumbName: "Home"
  },
  {
    path: `${rootPath}/backend/admin`,
    exact: true,
    component: Admin
  },
  {
    path: `${rootPath}/backend/login`,
    exact: true,
    component: Login
  },
  {
    path: `${rootPath}/backend/reset`,
    exact: true,
    component: ResetPassword
  },
  {
    path: `${rootPath}/:catid`,
    component: ProductPage,
    breadcrumbName: "Category",
    routes: [
      {
        path: `${rootPath}/:catid/:id`,
        exact: true,
        component: Product,
        breadcrumbName: "Product",
      }
    ]
  },
  {
    path: "*"
  }
];

export default routes;
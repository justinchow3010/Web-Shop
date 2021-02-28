import { useParams } from 'react-router-dom';
import { Main, Product, Admin, ProductPage } from './pages';
const rootPath = process.env.PUBLIC_URL;

const routes = [
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
    path: `${rootPath}/:cat`,
    component: ProductPage,
    breadcrumbName: "Category",
    routes: [
      {
        path: `${rootPath}/:cat/:id`,
        exact: true,
        component: Product,
        breadcrumbName: "Product",
      }
    ]
  },
  {
    path : "*"
  }
];




export default routes;
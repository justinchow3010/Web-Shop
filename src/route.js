import { Main, Product, Admin } from './pages';

const routes = [
  {
    path: '/',
    component: Main,
    exact: true,
    breadcrumbName: 'Home'
  },
  {
    path: '/product',
    component: Product,
    breadcrumbName: 'Product'
  },
  {
    path: '/backend/admin',
    component: Admin
  },
];

export default routes;
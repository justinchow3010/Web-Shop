import { Main, Product } from './pages';

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
];

export default routes;
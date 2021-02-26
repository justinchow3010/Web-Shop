import { Main, Product, Admin, Shoes } from './pages';
//const { url, path } = useRouteMatch();

const routes = [
  {
    path: '/',
    component: Main,
    exact: true,
    breadcrumbName: 'Home'
  },
  {
    path: '/shoes',
    
    component: Shoes,
    breadcrumbName: 'Shoes',
    routes: [
      {
        path: '/shoes/:id',
        exact: true,
        component: Product,
        breadcrumbName: "product",
      }
    ]
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
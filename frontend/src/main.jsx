import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import {PayPalScriptProvider} from '@paypal/react-paypal-js'
import store from '../store.js'
import HomeScreen from './Screens/HomeScreen.jsx';
import ProductScreen from './Screens/ProductScreen.jsx';
import CartScreen from './Screens/CartScreen.jsx'
import LoginScreen from './Screens/LoginScreen.jsx';
import RegisterScreen from './Screens/RegisterScreen.jsx';
import ShippinScreen from './Screens/ShippinScreen.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import PaymentScreen from './Screens/PaymentScreen.jsx';
import PlaceOrderScreen from './Screens/PlaceOrderScreen.jsx';
import OrderScreen from './Screens/OrderScreen.jsx';
import ProfileScreen from './Screens/ProfileScreen.jsx';
import OrderListScreen from './Screens/OrderListScreen.jsx';
import AdminRoute from './Components/AdminRoute.jsx';
import ProductListScreen from './Screens/ProductListScreen.jsx';
import ProductEditScreen from './Screens/ProductEditScreen.jsx';
import UserListScreen from './Screens/UserListScreen.jsx';
import UserEditScreen from './Screens/UserEditScreen.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element:<App />,
    children:[
      {
        index:true,
        element:<HomeScreen />
      },
      {
        path:'/product/:id',
        element:<ProductScreen />
      },
      {
        path:'/cart',
        element:<CartScreen />
      },
      {
        path:'/login',
        element:<LoginScreen />
      },
      {
        path:'/register',
        element:<RegisterScreen />
      },
      {
        element: <PrivateRoute />,
        children:[
          {
            path :'/shipping', 
            element : <ShippinScreen />
          },
          {
            path :'/payment', 
            element : <PaymentScreen />
          },
          {
            path :'/placeorder', 
            element : <PlaceOrderScreen />
          },
          {
            path :'/order/:id', 
            element : <OrderScreen />
          },
          {
            path :'/profile', 
            element : <ProfileScreen />
          },
        ]
      },
      {
        element:<AdminRoute />,
        children:[
          {
            path:'/admin/orderlist',
            element:<OrderListScreen />
          },
          {
            path:'/admin/productlist',
            element:<ProductListScreen />
          },
          {
            path:'/admin/product/:id/edit',
            element:<ProductEditScreen/>
          },
          {
            path:'/admin/userlist',
            element:<UserListScreen/>
          },
          {
            path:'/admin/user/:id/edit',
            element:<UserEditScreen />
          }
        ]
      }

    ]
  },
  
  
])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>,
)

import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AdminPanel from '../pages/AdminPanel';
import AdminOrders from '../pages/admin/AdminOrders';
import CreateProduct from '../pages/admin/CreateProduct';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminUsers from '../pages/admin/AdminUsers';
import Categories from '../pages/admin/Categories';
import AdminUpdateProduct from '../pages/admin/AdminUpdateProduct';
import FilterProducts from '../pages/FilterProducts';
import ProductDetails from '../pages/ProductDetails';
import UserCart from '../pages/user/Cart';
import SearchProducts from '../pages/SearchProducts';
import Account from '../pages/user/Account';
import Checkout from '../pages/user/Checkout';
import PaymentSuccess from '../pages/user/paymentSuccess';
import Orders from '../pages/user/Orders';
import ResetPassword from '../pages/ResetPassword';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "products/category/:category", element: <FilterProducts />},
            { path: "product/:id", element: <ProductDetails />},
            { path: "search", element: <SearchProducts /> },
            
            // public routes
            { element: <PublicRoute />,
                children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
         ]},
        //  protected route
        { element: <ProtectedRoute />,
            children: [
                {path:"cart", element:<UserCart />},
                {path:"account", element:<Account />},
                {path:"checkout", element:<Checkout />},
                {path:"payment-success", element:<PaymentSuccess />},
                {path:"orders", element:<Orders />}
            ]},
            
        //  admin  route
        { element: <AdminRoute />,
            children: [
                {path: "admin-panel", element:<AdminPanel />,
                    children: [
                {path: "users", element:<AdminUsers />},
                {path: "orders", element:<AdminOrders />},
                {path: "create-product", element:<CreateProduct />},
                {path: "update-product/:id", element:<AdminUpdateProduct />},
                {path: "categories", element:<Categories />}, 
                {path: "products", element:<AdminProducts />},
                ]}
            ]
        },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password/:token", element: <ResetPassword /> }
        ]

    }
])


export default router;
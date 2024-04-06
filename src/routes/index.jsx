
import LayoutDefault from "../components/LayoutDefault/LayoutDefault";
import HomePage from "../pages/client/HomePage/HomePage";
import OrderPage from "../pages/client/OrderPage/OrderPage";
import ProductDetailPage from "../pages/client/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/client/ProductsPage/ProductsPage";
import ProfilePage from "../pages/client/ProfilePage/ProfilePage";
import SingInPageClient from "../pages/client/SingInPage/SingInPage";
import SingUpPage from "../pages/client/SingUpPage/SingUpPage";
import SingInPageAdmin from "../pages/admin/SingInPage/SingInPage";
import LayoutAdminDefault from "../components/LayoutAdminDefault/LayoutAdminDefault";


export const Routes = [
    {
        path: '/',
        element: <LayoutDefault />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/products',
                element: <ProductsPage />
            },
            {
                path: '/order',
                element: <OrderPage />
            },
            {
                path: '/sing-in',
                element: <SingInPageClient />
            },
            {
                path: '/Sing-up',
                element: <SingUpPage />
            },
            {
                path: '/product-detail',
                element: <ProductDetailPage />
            },
            {
                path: '/profile',
                element: <ProfilePage />
            },
        ]
    },
    {
        path: '/system/admin',
        element: <SingInPageAdmin />
    },
    {
        path: '/system/admin/dashboard',
        element: <LayoutAdminDefault />
    }
    
]
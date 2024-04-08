
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
import DashBoardPage from "../pages/admin/DashBoardPage/DashBoardPage";
import PrivateRoutes from "../components/PrivateRoutes";
import PostPageMN from "../pages/admin/PostPageMN/PostPageMN";
import ProductPageMN from "../pages/admin/ProductPageMN/ProductPageMN";
import UserPageMN from "../pages/admin/UserPageMN/UsersPageMN";


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
        path: '/admin',
        element: <SingInPageAdmin />
    },
    {
        element: <PrivateRoutes />, 
        children: [
            {
                path: '/system/admin',
                element: <LayoutAdminDefault />,
                children: [
                    {
                        path: '',
                        element: <DashBoardPage />
                    },
                    {
                        path: 'posts', 
                        element: <PostPageMN />
                    },
                    {
                        path: 'products', 
                        element: <ProductPageMN />
                    },
                    {
                        path: 'users', 
                        element: <UserPageMN />
                    },
                    {
                        path: 'admin', 
                        element: <UserPageMN />
                    }
                ]
            }
        ]
    }
    
]
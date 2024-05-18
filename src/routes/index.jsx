
import LayoutDefault from "../components/LayoutDefault/LayoutDefault";
import HomePage from "../pages/client/HomePage/HomePage";
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
import QTVPageMN from "../pages/admin/QTVPageMN/QTVPageMN";
import CheckOutPage from "../pages/client/CheckOutPage/CheckOutPage";
import CartPage from "../pages/client/CartPage/CartPage";
import MyOrder from "../pages/client/MyOrder/MyOrder";
import MyOrderDetail from "../pages/client/MyOrderDetail/MyOrderDetail";
import OrderPageMN from "../pages/admin/OrderPageMN/OrderPageMN";
import TopicPageMN from "../pages/admin/TopicPageMN/TopicPageMN";
import AddPost from "../pages/admin/AddPost/AddPost";
import BlogPage from "../pages/client/BlogPage/BlogPage";
import BlogDetailPage from "../pages/client/BlogDetailPage/BlogDetailPage";
import EditBlog from "../pages/admin/EditBlog/EditBlog";
import RolePermission from "../pages/admin/RolePermissionPageMN/RolePermission";
import Roles from "../pages/admin/RolesPage/Roles";
import ForgotPassword from "../pages/client/SingInPage/ForgotPassword";
import OtpPassword from "../pages/client/SingInPage/OtpPassword";
import ResetPassword from "../pages/client/SingInPage/ResetPassword";
import CouponPage from "../pages/admin/CouponPage/CouponPage";
import DiscountPage from "../pages/client/DiscountPage/DiscountPage";


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
                path: '/blogs',
                element: <BlogPage />
            },
            {
                path: '/discounts',
                element: <DiscountPage />
            },
            {
                path: '/blog-detail/:id',
                element: <BlogDetailPage />
            },
            {
                path: '/my-order',
                element: <MyOrder />
            },
            {
                path: '/my-order-detail/:id',
                element: <MyOrderDetail />
            },
            {
                path: '/carts',
                element: <CartPage />
            },
            {
                path: '/checkout',
                element: <CheckOutPage />
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
                path: '/product-detail/:id',
                element: <ProductDetailPage />
            },
            {
                path: '/password/forgot',
                element: <ForgotPassword />
            },
            {
                path: '/password/otp/:email',
                element: <OtpPassword />
            },
            {
                path: '/password/reset/:email',
                element: <ResetPassword />
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
                        path: 'topics', 
                        element: <TopicPageMN />
                    },
                    {
                        path: 'posts', 
                        element: <PostPageMN />
                    },
                    {
                        path: 'addPost', 
                        element: <AddPost />
                    },
                    {
                        path: 'edit-blog/:id',
                        element: <EditBlog />
                    },
                    {
                        path: 'products', 
                        element: <ProductPageMN />
                    },
                    {
                        path: 'orders', 
                        element: <OrderPageMN />
                    },
                    {
                        path: 'coupons', 
                        element: <CouponPage />
                    },
                    {
                        path: 'users', 
                        element: <UserPageMN />
                    },
                    {
                        path: 'accounts', 
                        element: <QTVPageMN />
                    },
                    {
                        path: 'roles', 
                        element: <Roles />
                    },
                    {
                        path: 'roles/permission', 
                        element: <RolePermission />
                    }
                ]
            }
        ]
    }
    
]
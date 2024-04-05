import LayoutDefault from "../components/LayoutDefault/LayoutDefault";
import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import SingInPage from "../pages/SingInPage/SingInPage";
import SingUpPage from "../pages/SingUpPage/SingUpPage";


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
                element: <SingInPage />
            },
            {
                path: '/Sing-up',
                element: <SingUpPage />
            },
            {
                path: '/product-detail',
                element: <ProductDetailPage />
            }
        ]
    }
]
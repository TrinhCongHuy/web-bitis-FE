import { Layout } from 'antd'
import { Outlet } from 'react-router-dom';
import HeaderDefault from '../HeaderDefault/HeaderDefault';
import FooterDefault from '../FooterDefault/FooterDefault';
import './LayoutDefault.scss'

const { Content } = Layout;

function LayoutDefault () {

    return (
        <>
            <Layout className="layout__default">
                <HeaderDefault />
                <Content>
                    <Outlet />
                </Content>
                <FooterDefault />
            </Layout>
        </>
    )

}

export default LayoutDefault;
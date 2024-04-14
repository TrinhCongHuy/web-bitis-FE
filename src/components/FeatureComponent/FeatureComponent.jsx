import { Col, Row } from "antd";
import React from "react";
import './FeatureComponent.scss'
import { MoneyCollectOutlined, CarOutlined, CustomerServiceOutlined, SafetyCertificateOutlined } from '@ant-design/icons'


const FeatureComponent = () => {
    
    return (
        <>
            <Row style={{ display: 'flex', justifyContent: 'space-between'}}>
                <Col span={5}>
                    <div className="single__feature">
                        <div className="single__feature--title">
                            <MoneyCollectOutlined className="icon"/>
                            <h3>MUA NHIỀU GIẢM NHIỀU</h3>
                        </div>
                        <p>Giảm gía lên tận 50%</p>
                    </div>
                </Col>
                <Col span={5}>
                    <div className="single__feature">
                        <div className="single__feature--title">
                            <CarOutlined className="icon"/>
                            <h3>MIỄN PHÍ VẬN CHUYỂN</h3>
                        </div>
                        <p>Phạm vi trong khoảng 5km</p>
                    </div>
                </Col>
                <Col span={5}>
                    <div className="single__feature">
                        <div className="single__feature--title">
                            <CustomerServiceOutlined className="icon"/>
                            <h3>SẴN SÀNG HỖ TRỢ</h3>
                        </div>
                        <p>Chỉ cần liên hệ với chúng tôi</p>
                    </div>
                </Col>
                <Col span={5}>
                    <div className="single__feature">
                        <div className="single__feature--title">
                            <SafetyCertificateOutlined className="icon"/>
                            <h3>AN TOÀN THANH TOÁN</h3>
                        </div>
                        <p>Các cổng thanh toán uy tín</p>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default FeatureComponent;
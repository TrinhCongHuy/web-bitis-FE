import { Col, Row, Space } from 'antd'
import React from 'react'
import './FooterDefault.scss'
import { FacebookOutlined, InstagramOutlined, GithubOutlined, GitlabOutlined, TwitterOutlined, LinuxOutlined, DockerOutlined, TikTokOutlined, SpotifyOutlined} from '@ant-design/icons'

const FooterDefault = () => {
  return (
    <div className='footer'>
      <div className="footer__main">
        <div className="container">
          <Row>
            <Col span={24}>
              {/* <div className="footer__main--logo" style={{textAlign: 'center'}}>
                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span className="bitis-line"></span>
                  <span className="bitis-line" style={{marginLeft: '8px', height: '23px'}}></span>
                  <span className="bitis-line" style={{marginLeft: '16px', height: '18px'}}></span>
                </span>
                
                <span>Biti's</span>
              </div> */}
              <div className="footer__main--info">
                <Row>
                  <Col span={6}>
                    <h3>VỀ BITI'S</h3>
                    <p>Về Biti's</p>
                    <p>Câu chuyện Biti's</p>
                    <p>Bước tiến phát triển</p>
                    <p>Hoạt động</p>
                    <p>Liên hệ</p>
                  </Col>
                  <Col span={6}>
                    <h3>THÔNG TIN</h3>
                    <p>Trạng thái đơn hàng</p>
                    <p>Hình thức giao hàng</p>
                    <p>Hình thức thanh toán</p>
                    <p>Chính sách đổi trả</p>
                    <p>Chính sách bảo hành</p>
                    <p>Chính sách khách hàng thân thiết</p>
                  </Col>
                  <Col span={6}>
                    <h3>TRỢ GIÚP</h3>
                    <p>Tuyển dụng</p>
                    <p>Hệ thống cửa hàng</p>
                    <p>Liên hệ hợp tác</p>
                    <p>Q&A</p>
                  </Col>
                  <Col span={6}>
                    <h3>LIÊN HỆ</h3>
                    <p>Địa chỉ: 22 Lý Chiêu Hoàng, Phường 10, Quận 6, TP. Hồ Chí Minh</p>
                    <p>Điện thoại:  (028) 38 753 443</p>
                    <p>Email: chamsockhachhang@bitis.com.vn</p>
                    <p>Hotline: 0966158666</p>
                    <p>Thời gian tư vấn: 8h – 21h30 các ngày trong tuần (trừ ngày Lễ, Tết)</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <Row>
            <Col span={24}>
              <div className="footer__bottom--socials">
                <h3>Follow us</h3>
                <ul className='social__list'>
                  <li><FacebookOutlined className='icon'/></li>
                  <li><InstagramOutlined className='icon'/></li>
                  <li><GithubOutlined className='icon'/></li>
                  <li><GitlabOutlined className='icon'/></li>
                  <li><TwitterOutlined className='icon'/></li>
                  <li><LinuxOutlined className='icon'/></li>
                  <li><DockerOutlined className='icon'/></li>
                  <li><TikTokOutlined className='icon'/></li>
                  <li><SpotifyOutlined className='icon'/></li>
                </ul>
              </div>
              <div className='footer__bottom--copyright'>
                <span>Copyright © 2024 Biti's. Powered by Trịnh Công Huy</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default FooterDefault
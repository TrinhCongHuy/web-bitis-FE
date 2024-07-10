import { Button, Col, Row, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'
import * as CouponService from '../../../services/CouponService'
import moment from 'moment';
import { copy } from 'clipboard';


const DiscountPage = () => {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupon = async () => {
    const res = await CouponService.listCoupon()
    setCoupons(res.data)
  }

  useEffect(() => {
    fetchCoupon()
  }, [])

  const handleCopyCoupon = (code) => {
    copy(code)
    message.success('Sao chép mã giảm giá thành công')
  }

  return (
    <div className="container page__discount">
      <Row>
        <Col span={24}>
          <div className='banner__voucher' style={{width: '100%', height: '600px'}}>
            <img src="https://down-vn.img.susercontent.com/file/ba098e3768411e8adbe50cf902ddd9b3" style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="banner" />
          </div>
          <div className='voucher__list' style={{marginTop: '20px'}}>
            <div style={{width: '600px', background: '#d53d25', padding: '0.1em', borderRadius: '20px', boxShadow: '#0d53af 0px 14px 28px, #094a9f 0px 10px 10px', textAlign: 'center'}}>
              <h1 style={{fontSize: '2em', color: '#ffffff'}}>Voucher hôm nay</h1>
            </div>

            <Row style={{marginTop: '100px'}}>
              {coupons?.length > 0 ? 
                (coupons?.map((coupon, index) => {
                  const isExpired = moment(coupon?.expireAt).isBefore(moment());
                  return (
                    <Col key={index} span={10} style={{margin: '0 15px'}}>
                      <div style={{display: 'flex', alignItems: 'center', margin: '8px 0', padding: '10px', background: '#d9f1fd', borderRadius: '10px'}}>
                        <Space size='large'>
                          <img src={coupon?.image} alt='coupon' style={{width: '80px', height: '80px', objectFit: 'cover'}}/>
                          <div style={{lineHeight: '0.8em', color: '#000', marginTop: '10px'}}>
                            <div style={{fontSize: '1.2em'}}>Giảm giá {coupon?.discount}%</div>
                            <p>Mã: {coupon?._id}</p>
                            <p>HSD: {moment(coupon?.expireAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                          </div>
                          <Button type="primary" danger size='middle' style={{fontSize: '0.9em'}} onClick={() => handleCopyCoupon(coupon?._id)} disabled={isExpired}>
                            {isExpired ? 'Hết hạn' : 'Lưu'}
                          </Button>
                        </Space>
                      </div>
                    </Col>
                  );
                }))
                : <>
                  <span style={{ fontSize: '1.6rem', fontWeight: 600, color: '#000'}}>Không có mã giảm giá nào cả ^-^</span>
                </>
              }
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DiscountPage;

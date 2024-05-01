import { Button, Form, Input, Modal, Select } from 'antd'
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'



const ModalAddressComponent = (props) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const { Option } = Select;
  const [showCityOptions, setShowCityOptions] = useState(false);
  const user = useSelector((state) => state?.user)


  const { isShow, onCancel} = props

  const handleInputChange = () => {
    setShowCityOptions(true);
    fetchCityData();
  };

  const fetchCityData = async () => {
    try {
      const response = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const handleCityChange = (value) => {
    const selectedCity = cities.find(city => city.Id === value);
    if (selectedCity) {
      setDistricts(selectedCity.Districts);
      setSelectedCity(selectedCity.Name);
    }
  };

  const handleDistrictChange = (value) => {
    const selectedDistrict = districts.find(district => district.Id === value);
    if (selectedDistrict) {
      setWards(selectedDistrict.Wards);
      setSelectedDistrict(selectedDistrict.Name);
    }
  };

  const handleWardChange = (value) => {
    const selectedWard = wards.find(ward => ward.Id === value);
    if (selectedWard) {
      setSelectedWard(selectedWard.Name);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const onFinish = async (values) => {
    try {
      const userId = user?.id;
      const existingDefaultAddress = user.address.find(address => address.isDefault);
      
      const newAddress = {
          recipientName: values?.recipientName,
          overallAddress: values?.overallAddress,
          specificLocation: values?.specificLocation,
          phoneNumber: values?.phoneNumber,
          isDefault: !existingDefaultAddress
      };

      await UserService.updateUser({
        id: userId,
        access_token: user?.access_token,
        rests: {
          $push: { address: newAddress }
        }
      });

      onCancel()
    } catch (error) {
        console.error('Lỗi khi lưu địa chỉ mới:', error);
    }
    
  }

  return (
    <>
        <Modal title="Thêm mới địa chỉ" open={isShow} footer={false} onCancel={handleCancel}>
            <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 24,
            }}
            style={{
                maxWidth: 600,
                marginTop: '20px'
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
            >
            <Form.Item
                name="recipientName"
                rules={[
                {
                    required: true,
                    message: 'Please input your name!',
                },
                ]}
                style={{
                display: 'inline-block',
                width: 'calc(50% - 8px)',
                }}
            >
                <Input placeholder='Họ tên'/>
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                rules={[
                {
                    required: true,
                    message: 'Please input your phone!',
                },
                ]}
                style={{
                display: 'inline-block',
                width: 'calc(50% - 8px)',
                margin: '0 0 0 16px',
                }}
            >
                <Input placeholder='Phone'/>
            </Form.Item>
            <Form.Item
                name="overallAddress"
                rules={[
                {
                    required: true,
                    message: 'Please input your address!',
                },
                ]}
            >
                <div>
                <Input onFocus={handleInputChange} value={`${selectedCity}, ${selectedDistrict}, ${selectedWard}`} placeholder='Tỉnh/Thành phố, Quận/Huyện, Phường/Xã'/>
                {showCityOptions && (
                    <div style={{marginTop: '3px'}}>
                    <Select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-sm"
                        onChange={handleCityChange}
                        placeholder="Chọn tỉnh thành"
                        style={{
                        display: 'inline-block',
                        width: '32%',
                        }}
                    >
                        <Option value="" selected>Chọn tỉnh thành</Option>
                        {cities.map(city => (
                        <Option key={city.Id} value={city.Id}>{city.Name}</Option>
                        ))}
                    </Select>
                    <Select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-sm"
                        onChange={handleDistrictChange}
                        placeholder="Chọn quận huyện"
                        style={{
                        display: 'inline-block',
                        width: '32%',
                        margin: '0 8px'
                        }}
                    >
                        <Option value="" selected>Chọn quận huyện</Option>
                        {districts.map(district => (
                        <Option key={district.Id} value={district.Id}>{district.Name}</Option>
                        ))}
                    </Select>
                    <Select
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm"
                        placeholder="Chọn phường xã"
                        onChange={handleWardChange}
                        style={{
                        display: 'inline-block',
                        width: '32%',
                        }}
                    >
                        <Option value="" selected>Chọn phường xã</Option>
                        {wards.map(ward => (
                        <Option key={ward.Id} value={ward.Id}>{ward.Name}</Option>
                        ))}
                    </Select>
                    </div>
                )}
                </div> 
            </Form.Item>

            <Form.Item
                name="specificLocation"
                rules={[
                {
                    required: true,
                    message: 'Please input your specificLocation!',
                },
                ]}
            >
                <Input placeholder='Địa chỉ cụ thể...'/>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                offset: 20,
                span: 24,
                }}
            >
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </Form.Item>
            </Form>
        </Modal>
    </>
  )
}

export default ModalAddressComponent
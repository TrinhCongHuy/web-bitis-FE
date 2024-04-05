import { Select, Space } from "antd"
import './FilterProduct.scss'


const FilterProduct = () => {
    const options = [
        {
            value: '',
            label: 'Phổ biến',
        },
        {
          value: 'selling',
          label: 'Bán chạy',
        },
        {
          value: 'new-product',
          label: 'Hàng mới',
        },
    ];

    const optionsColor = [
        {
            value: '',
            label: 'Màu sắc',
        },
        {
          value: 'red',
          label: 'Đỏ',
        },
        {
          value: 'green',
          label: 'Xanh lá cây',
        },
    ];

    const optionsSize = [
        {
            value: '',
            label: 'Kích thướt',
        },
        {
          value: '30',
          label: '30',
        },
        {
          value: '31',
          label: '31',
        },
    ];

    const optionsPrice = [
        {
            value: '',
            label: 'Giá',
        },
        {
          value: 'desc',
          label: 'Giảm dần',
        },
        {
          value: 'asc',
          label: 'Tăng dần',
        },
    ];

    return (
        <div className="filter__product">
            <Space>
                <Select defaultValue="" options={options} style={{ width: '180px' }}/>
                <Select defaultValue="" options={optionsColor} style={{ width: '180px' }}/>
                <Select defaultValue="" options={optionsSize} style={{ width: '180px' }}/>
                <Select defaultValue="" options={optionsPrice} style={{ width: '180px' }}/>
            </Space>
        </div>
    )
}

export default FilterProduct
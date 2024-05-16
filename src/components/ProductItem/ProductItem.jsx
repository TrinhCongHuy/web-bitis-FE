import { Link } from 'react-router-dom';
import './ProductItem.scss'
import { Image } from 'antd';



function ProductItem({ data }) {
  return (
    <Link to={`/product-detail/${data._id}`} className='wrapper-product'>
      <Image preview={false} className='avatar' src={data.images[0]} alt='image-product' />
      <div className='info'>
        <div className='info-name'>{data.name}</div>
        <span>{data?.price} đ</span>
      </div>
    </Link>
  );
}

export default ProductItem;

import { useEffect, useState, useRef } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import * as ProductServices from '../../services/ProductService';

import './Search.scss'
import useDebounce from '../../hooks/useDebounce';
import { CloseOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import ProductItem from '../ProductItem/ProductItem';

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(searchValue, 500);

  const inputRef = useRef();

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);

      const result = await ProductServices.listProduct(debouncedValue, 6);
      setSearchResult(result?.data);

      setLoading(false);
    };

    fetchApi();
  }, [debouncedValue]);

  const handleClear = () => {
    setSearchValue('');
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  return (
    <div>
      <HeadlessTippy
        interactive
        placement="bottom"
        visible={showResult}
        render={(attrs) => (
          <div className='search-result' tabIndex="-1" {...attrs}>
            <div>
              {searchResult.map((data, index) => (
                <ProductItem key={index} data={data} />
              ))}
            </div>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div className='search'>
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Search products"
            spellCheck={false}
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
          />
          {!!searchValue && !loading && (
            <button className='clear' onClick={handleClear}>
              <CloseOutlined />
            </button>
          )}
          {loading && <LoadingOutlined className='loading'/> }

          <button className='search-btn' onMouseDown={(e) => e.preventDefault()}>
            <SearchOutlined />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;

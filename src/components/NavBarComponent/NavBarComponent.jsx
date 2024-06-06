import React, { useState } from "react";
import './NavBarComponent.scss'
import { Checkbox } from "antd";
import { Link } from "react-router-dom";
import * as CategoryService from '../../services/CategoryService'
import { useQuery } from '@tanstack/react-query'




const NavBarComponent = (props) => {
    const { onTypeClick } = props
    const [activeLink, setActiveLink] = useState(null);

    // fetch types product
    const fetchTypesProduct = async () => {
        const res = await CategoryService.listCategory()
        return res.data
    }

    const { data: typesProduct } = useQuery({
        queryKey: ['products'], 
        queryFn: fetchTypesProduct, 
        config: {
        retry: 3,
        retryDelay: 1000,
        keePreviousData: true
        }
    });

    const handleTypeProduct = (type) => {
        onTypeClick(type)
        setActiveLink(type)
    }
    
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option, index) => {
                    return <div key={index} style={{padding: '10px 0'}}>
                        <Link className={`text-link ${activeLink === option?.slug ? 'active' : ''}`} onClick={() => handleTypeProduct(option?.slug)}>{option?.name}</Link>
                    </div>
                })
            case 'checkbox':
                return <Checkbox.Group style={{ width: '100%', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {
                            options.map((option, index) => {
                                return <Checkbox key={index} value={option.value}>{option.lable}</Checkbox>
                            })
                        }
                    </Checkbox.Group>
            default: 
                return {}
        }
    }
    return (
        <>
            <div className="navbar">
                <div className="navbar-title">
                    Các danh mục
                </div>
                <div className="navbar-content">
                    {typesProduct && renderContent('text', [...typesProduct])}
                    
                    {/* {renderContent('checkbox', [
                        {value: 'A', lable: 'A'},
                        {value: 'B', lable: 'B'},
                        {value: 'C', lable: 'C'},

                    ])} */}

                </div>
            </div>
        </>
    )
}

export default NavBarComponent;
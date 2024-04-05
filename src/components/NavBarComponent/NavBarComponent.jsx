import React from "react";
import './NavBarComponent.scss'
import { Checkbox } from "antd";
import { Link } from "react-router-dom";


const NavBarComponent = () => {
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option, index) => {
                    return <div  key={index} style={{padding: '10px 0', borderBottom: '1px solid #999'}}>
                        <Link style={{color: '#000'}}>{option}</Link>
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
                    Danh mục sản phẩm
                </div>
                <div className="navbar-content">
                    {renderContent('text', ['Nam', 'Nữ', 'Bé trai', 'Bé gái', 'Phụ kiện'])}
                    {renderContent('checkbox', [
                        {value: 'A', lable: 'A'},
                        {value: 'B', lable: 'B'},
                        {value: 'C', lable: 'C'},

                    ])}

                </div>
            </div>
        </>
    )
}

export default NavBarComponent;
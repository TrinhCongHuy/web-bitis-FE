import React from 'react'
import './SuggestiveComponent.scss'
import { Col, Row } from 'antd'

const SuggestiveComponent = ({ title, description }) => {
  return (
    <div className='box__suggest'>
        <Row>
            <Col span={24}>
                <h2>{title}</h2>
                <hr />
                <p>{description}</p>
            </Col>
        </Row>
    </div>
  )
}

export default SuggestiveComponent
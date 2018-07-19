import React from 'react';
import {  Card , Row , Col , Icon  } from 'antd';
import styleCss from './detailCard.css';

export default class DetailCard extends React.Component{



    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){

        return (
            <Card 
                title={"订单号 "+this.props.data.ddh} 
                extra={<font color={'red'}>待确认</font>} style={{ width: '100%' }}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}   
            >
                <Row className={styleCss.c01}>
                    <Col>联系电话：{this.props.data.lxdh}</Col>
                </Row>
                <Row className={styleCss.c01}>
                    <Col>配送地址：{this.props.data.psdz}</Col>
                </Row>
                <Row className={styleCss.c01}>
                     <Col>配送时间：{this.props.data.pssj}</Col>
                </Row>
                <Row className={styleCss.c01}>
                    <Col>订购的商品：{this.props.data.pssj}</Col>
                </Row>
                <Row className={styleCss.c01}>
                    <Col span={12}>最终售价：{this.props.data.zzsj}</Col>
                    <Col span={12}>最终售价：{this.props.data.yj}</Col>
                </Row>
                <Row className={styleCss.c01}>
                    <Col span={12}>需要准备的时间：{this.props.data.zbsj}</Col>
                    <Col span={12}>导购：{this.props.data.dgmc}</Col>
                </Row>
            </Card>
        )
    }
}
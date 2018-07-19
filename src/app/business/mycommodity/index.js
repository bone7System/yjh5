import React from 'react';
import { Row , Col  } from 'antd';
import styleCss from './index.css';
import bannerImg from './images/banner.jpg';
import DetailCard from './detailCard';
import {createUuid } from '../../../utils/NHCore';

export default class Top extends React.Component{

    constructor(props){
        super(props);
        this.state={
            list:[
                {mc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',gg:'橡木色80*50【升级加厚】黑色80x40cm【升级加厚】',xh:'cz001',jg:'¥ 109.0元'},
                {mc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',gg:'橡木色80*50【升级加厚】黑色80x40cm【升级加厚】',xh:'cz001',jg:'¥ 109.0元'},
                {mc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',gg:'橡木色80*50【升级加厚】黑色80x40cm【升级加厚】',xh:'cz001',jg:'¥ 109.0元'},
                {mc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',gg:'橡木色80*50【升级加厚】黑色80x40cm【升级加厚】',xh:'cz001',jg:'¥ 109.0元'}
            ]
        }
    }

    render(){

        let list = [];
        const dataList = this.state.list?this.state.list:[];
        for (let i =0 ;i< dataList.length;){
            list.push(<Row key={createUuid()}>
                <Col span={6} className={styleCss.c09} style={{paddingRight:'15px'}}>{dataList[i]?<DetailCard data = {dataList[i]}/>:''}</Col>
                <Col span={6} className={styleCss.c09} style={{paddingLeft:'5px',paddingRight:'10px'}}>{dataList[i+1]?<DetailCard data = {dataList[i+1]}/>:''}</Col>
                <Col span={6} className={styleCss.c09} style={{paddingLeft:'10px',paddingRight:'5px'}}>{dataList[i+2]?<DetailCard data = {dataList[i+2]}/>:''}</Col>
                <Col span={6} className={styleCss.c09} style={{paddingLeft:'15px'}}>{dataList[i+3]?<DetailCard data = {dataList[i+3]}/>:''}</Col>
            </Row>);
            i=i+4;
        }

        return (
            <div className={styleCss.c01}>
                <div>
                    <img src={bannerImg} alt={''} className={styleCss.c02} />
                </div>
                <div className={styleCss.c03}>
                    {list}
                </div>

                 {/* <Affix offsetBottom={0} >
                    <Button>120px to affix top</Button>
                </Affix> */}
            </div>
        )
    }
}
import React from 'react';
import {  Card  } from 'antd';
// import styleCss from './detailCard.css';
import errorImg from './images/error.png';

export default class DetailCard extends React.Component{



    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){

        return (
            <Card
                style={{ width: '100%' }}
                cover={<img alt="" src={errorImg} />}
                
            >
                
            </Card>
        )
    }
}
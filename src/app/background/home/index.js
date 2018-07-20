import React from 'react';
// import { Row , Col} from 'antd';
import styleCss from './index.css';
import getSize from '../../../utils/getSize';

export default class Content extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <div className={styleCss.main_right_content} style={{height:getSize().windowH-80}}>
                <div className={styleCss.table} >
                   这是首页
                </div>
            </div>
        )
    }
}
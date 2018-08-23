import React from 'react';
//import { Button} from 'antd';
import styleCss from './index.css';

export default class Footer extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <div className={styleCss.topCss}>
                <div className={styleCss.css01}>
                    <div className={styleCss.css02}>
                        帮助&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隐私&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;条款
                    </div>
                    <div className={styleCss.css03}>
                             copyright@2018&nbsp;一家系统技术部出品
                    </div>
                </div>
            </div>
        )
    }
}
import React from 'react';
//import { Button} from 'antd';
import styleCss from './index.css';

export default class Content extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <div className={styleCss.topCss} style={{minHeight:this.props.height}}>
                {this.props.children}
            </div>
        )
    }
}
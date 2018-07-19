import React from 'react';
import { Row , Col} from 'antd';
import styleCss from './index.css';

export default class Content extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (
            <div>
                <Row>
                    <Col span={15}>
                        <div className={styleCss.leftDiv}>
                            <div className={styleCss.c01}>

                            </div>
                            <div className={styleCss.c02}>

                            </div>
                        </div>
                    </Col>
                    <Col span={9}>
                        <div className={styleCss.rightDiv}>
                            <div className={styleCss.c03}>

                            </div>
                            <div className={styleCss.c04}>

                            </div>
                            <div className={styleCss.c05}>

                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
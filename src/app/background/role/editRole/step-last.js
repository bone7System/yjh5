import React, {Component} from "react";
import {Row, Col, Icon, Button} from 'antd';
import PropTypes from 'prop-types';
import style from '../index.css';

/**
 * 最后步骤——完成
 */
class LastStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {update, status} = this.props;

        return (
            <div>
                <Row type="flex" justify="center" align="middle">
                    <Col span={12} style={{textAlign:'center'}}>
                        {
                            this.props.status ? <Icon type="check-circle" className={style["finish-circle-success"]}/>
                                : <Icon type="check-circle" className={style["finish-circle-failed"]}/>
                        }
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={12} style={{textAlign:'center'}}>
                        <p style={{margin:'1rem 0'}} className={style["finish-tip-title"]}>
                            {this.props.status ? '设置成功' : '设置失败'}
                        </p>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={12} style={{textAlign:'center'}}>
                        <p style={{margin:'0 0 1rem'}}>
                            {status && !update ? '角色配置完成，可返回列表'
                                : status && update ? '角色配置完成，返回列表点击查看配置详情' : '角色配置失败，请重新配置！'}
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }
}

LastStep.defaultProps = {
    update: false,
    status: false, //是否配置成功
}

LastStep.propTypes = {
    update: PropTypes.bool, //是否是修改操作
    status: PropTypes.bool, //是否配置成功
    onReset: PropTypes.func //重置回调
}

export default LastStep;

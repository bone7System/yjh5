import React from 'react';
import { Row, Col, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './style.css';
import PropTypes from "prop-types";
import { createUuid } from '../../utils/NHCore';

/**
 * 自定义容器框架
 * 适用于表单字段较多时（>5个）的新增、修改、查看页面显示
 * Author: zengxiangkai@ly-sky.com
 * Created on: 2018-01-29 18:06:42
 * Version: 1.0
 * Modify log:
 * 2018-03-01:将标题移到页面左上角，按钮调整到页面右上角
 */
class NHContainerFrame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }

    UNSAFE_componentWillMount() {
       
    }

    stopLoading = () => {
        this.setState({
            loading:false
        });
    }

    handleSave = () => {
        this.setState({
            loading:true
        });
        if(this.props.onOk){
            this.props.onOk(this.stopLoading);
        }
    }

    render() {
        
        const { title, description, visible, style, contentWidth, footer, onCancel , scrollHeight } = this.props;

        //最外层容器框架样式
        const frameStyle = {
            display: visible ? "block" : "none",
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: "#fff"
        };


        //内容区域(自动扩展高度)
        const contentAutoHeight=<Row type="flex" justify="center" className={styles.content_c}>
                                    <Col span={contentWidth}>
                                        <Row type="flex" justify="center">
                                            <Col span={24}>
                                                <div>
                                                    {this.props.children}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
        //内容区域(固定高度)
        const contentFixedHeight=<Scrollbars autoHide style={{ width: '100%', height: scrollHeight }}>
                                    <Row type="flex" justify="center" className={styles.content_c}>
                                        <Col span={contentWidth}>
                                            <Row type="flex" justify="center">
                                                <Col span={24}>
                                                    <div>
                                                        {this.props.children}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Scrollbars>

        //添加按钮
        let buttons = [];
        //处理自定义按钮
        if (footer != null && footer.length > 0) {
            for (let buttonParam of footer) {
                //text：按钮描述，type：按钮类型，icon：按钮图标，onClick：按钮点击事件
                let {text = "", type = "primary", icon = "", onClick = () => {}} = buttonParam;
                let customButton = (
                    <Col key={createUuid()}>
                        <Button type={type} icon={icon} onClick={onClick}>
                            {text}
                        </Button>
                    </Col>
                );
                buttons.push(customButton);
            }
        }else{
            buttons.push(<Col key={createUuid()}>
                <Button type="primary" onClick={this.handleSave} loading={this.state.loading}>
                    保存
                </Button>
            </Col>);
        }

        buttons.push(
            <Col key={createUuid()}>
                <Button onClick={onCancel}>
                    返回
                </Button>
            </Col>
        );

        //如果没有自定义按钮，则使用默认的“取消”、“确认”按钮
        //条件渲染
        if (visible) {
            return (
                <div className="div-containerFrame" style={style ? style : frameStyle}>
                    {/*头部区域*/}
                    <Row type="flex" justify="space-between" className={styles.content_t}>
                        <Col span={16}>
                            <div className={styles.title}>
                                {title}
                            </div>
                            {
                                description ? <div className={styles.description}>
                                    {description}
                                </div> : null
                            }
                        </Col>
                        <Col span={8} className={styles.content_t_r}>
                            <Row type="flex" justify="end" align="middle" gutter={16} style={{ height: '100%' }}>
                                {buttons}
                            </Row>
                        </Col>
                    </Row>
                    {
                        scrollHeight?contentFixedHeight:contentAutoHeight
                    }
                    
                </div>
            );
        } else {
            return null;
        }
    }
}

/**
 *  NHContainerFrame默认属性
 */
NHContainerFrame.defaultProps = {
    title: "标题", //页面标题
    visible: false, //默认不可见
    contentWidth: 24, //内容宽度，以24列栅格为准
    onOk: () => { },
    scrollHeight: undefined,
}

/**
 *  NHContainerFrame属性检查
 */
NHContainerFrame.propTypes = {
    title: PropTypes.string, //页面标题
    description: PropTypes.string, //页面描述
    visible: PropTypes.bool, //是否显示
    style: PropTypes.object, //样式
    footer: PropTypes.arrayOf(PropTypes.object),//按钮组
    contentWidth: PropTypes.number, //内容区域宽度，24栅格
    onOk: PropTypes.func, //保存事件回调方法
    onCancel: PropTypes.func.isRequired //返回事件回调方法
}

export default NHContainerFrame;
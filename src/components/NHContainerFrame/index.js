import React from 'react';
import { Row, Col, Button, Spin } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import getSize from '../../utils/getSize';
import { createUuid } from '../../utils/NHCore';
import PropTypes from "prop-types";
import './style.css';

//页面默认偏移高度
const offsetHeight = 153;

class NHContainerFrame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            titleDivId: createUuid(), //标题头 div 元素ID
            titleDivHeight: 0, //标题头 div 元素高度
            scrollHeight: 200, //默认滚动高度
            loading: false, //加载中状态
        }
    }

    componentDidUpdate() {

        //计算内容区域滚动高度
        const { titleDivId, titleDivHeight } = this.state;

        let titleDiv = document.getElementById(titleDivId);

        if (titleDiv) {
            let nextHeight = titleDiv.clientHeight;
            if (nextHeight != titleDivHeight) {
                this.setState({ titleDivHeight: nextHeight, scrollHeight: getSize().windowH - (offsetHeight + nextHeight) });
            }

        }
    }

    stopLoading = () => {
      this.setState({
          loading:false
      });
  }

    /**
     * * 设置loading状态
     * @memberof NHContainerFrame
     */
    loading = (value) => {
        this.setState({ loading: value });
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

        const { titleDivId, scrollHeight, loading } = this.state;
        const { title, description, visible, style, contentWidth, footer, onOk, onCancel } = this.props;

        //最外层容器框架样式
        const frameStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
            padding: '0 16px',
            display: visible ? "block" : "none",
            backgroundColor: "#fff"
        };

        //如果没有自定义按钮，则使用默认的“取消”、“确认”按钮
        //条件渲染
        if (footer === undefined && visible) {
            return (
                <div className="div-containerFrame" style={style ? style : frameStyle}>
                    <Spin spinning={loading}>
                        <Row id={titleDivId} type="flex" justify="space-between" className={'xgui_containerFrame_content_t'}>
                            <Col span={16}>
                                <div className={'xgui_containerFrame_title'}>
                                    {title}
                                </div>
                                {
                                    description ? <div className={'xgui_containerFrame_description'}>
                                        {description}
                                    </div> : null
                                }
                            </Col>
                            <Col span={8} >
                                <Row type="flex" justify="end" align="top" gutter={16} style={{ height: '100%' }}>
                                    {
                                        onOk? <Col>
                                            <Button type="primary"onClick={this.handleSave} loading={this.state.loading}>
                                                保存
                                            </Button>
                                        </Col>:undefined
                                    }
                                    <Col>
                                        <Button onClick={onCancel}>
                                            返回
                                    </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Scrollbars autoHide style={{ width: '100%', height: scrollHeight }}>
                            <Row type="flex" justify="center" className={'xgui_containerFrame_description'}>
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
                    </Spin>
                </div>
            );
        } else if (visible) {
            let buttons = [];

            //处理自定义按钮
            if (footer != null && footer.length > 0) {

                for (let index = 0; index < footer.length; index++) {
                    //text：按钮描述，type：按钮类型，icon：按钮图标，onClick：按钮点击事件
                    let { text = "", type = "primary", icon = "", loading = false, onClick = () => { } } = footer[index];
                    let customButton = (
                        <Col key={index}>
                            <Button type={type} icon={icon} onClick={onClick} loading={loading}>
                                {text}
                            </Button>
                        </Col>
                    );
                    buttons.push(customButton);
                }
            }

            buttons.push(
                <Col key={"-1"}>
                    <Button onClick={onCancel}>
                        返回
                    </Button>
                </Col>
            );

            return (
                <div className="div-containerFrame" style={style ? style : frameStyle}>
                    <Spin spinning={loading}>
                        <Row id={titleDivId} type="flex" justify="space-between" className={'xgui_containerFrame_content_t'}>
                            <Col span={16}>
                                <div className={'xgui_containerFrame_title'}>
                                    {title}
                                </div>
                                {
                                    description ? <div className={'xgui_containerFrame_description'}>
                                        {description}
                                    </div> : null
                                }
                            </Col>
                            <Col span={8} >
                                <Row type="flex" justify="end" align="top" gutter={16} style={{ height: '100%' }}>
                                    {buttons}
                                </Row>
                            </Col>
                        </Row>
                        <Scrollbars autoHide style={{ width: '100%', height: scrollHeight }}>
                            <Row type="flex" justify="center" className={'xgui_containerFrame_description'}>
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
                    </Spin>
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
}

/**
 *  NHContainerFrame属性检查
 */
NHContainerFrame.propTypes = {
    title: PropTypes.string, //页面标题
    description: PropTypes.node, //页面描述
    visible: PropTypes.bool, //是否显示
    style: PropTypes.object, //样式
    footer: PropTypes.arrayOf(PropTypes.object),//按钮组
    contentWidth: PropTypes.number, //内容区域宽度，24栅格
    onOk: PropTypes.func, //保存事件回调方法
    onCancel: PropTypes.func.isRequired //返回事件回调方法
}

export default NHContainerFrame;

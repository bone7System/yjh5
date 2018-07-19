import React from 'react';
import { Modal, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from "prop-types";


//Modal的最大宽度、高度为屏幕宽度、高度的2/3
const maxWidth = window.screen.width * 2 / 3;
const maxHeight = window.screen.height * 2 / 3;

//确认对话框
const confirm = Modal.confirm;

/**
 * Ant Design Modal 模态对话框二次封装
 * Author: zengxiangkai@ly-sky.com
 * Created on: 2018-01-23 14:37:19
 * Version: 1.0
 * Modify log:
 * 2018-05-25：
 *  1、解决控制台警告问题；
 *  2、对话框居中；
 *  3、点击保存按钮后，保存按钮默认变成loading状态，
 *     可在onOk回调方法中调用回调函数stopLoading来终止按钮的loading状态；
 * 2018-06-04:
 *  1、“保存”按钮更改为“确认”
 */
export class NHModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false, //默认不可见
            confirmLoading: false //确定按钮 loading
        }
    }

    //显示
    show = () => {
        this.setState({ visible: true });
    }

    //关闭
    close = () => {
        this.setState({ visible: false, confirmLoading: false });
    }

    //隐藏加载动画
    stopLoading = () => {
        this.setState({ confirmLoading: false });
    }

    //确认
    handleOk = () => {
        this.setState({ confirmLoading: true });
        this.props.onOk(this.stopLoading);
    };

    //取消
    handleCancel = () => {
        this.close();
        this.props.onCancel();
    };

    render() {

        const { visible, confirmLoading } = this.state;
        const { title, style, bodyStyle, maxSize, destroyOnClose, footer, afterClose } = this.props;
        let width = this.props.width;

        if (maxSize) {
            width = maxWidth;
        } else if (width > maxWidth) {
            width = maxWidth;
        }

        //如果未定义页脚按钮，则使用默认按钮
        if (footer === undefined && visible) {
            return (
                <div>
                    <Modal
                        title={title}
                        style={style}
                        bodyStyle={bodyStyle}
                        visible={visible}
                        width={width}
                        okText="确定"
                        onOk={this.handleOk}
                        cancelText="返回"
                        onCancel={this.handleCancel}
                        wrapClassName="vertical-center-modal"
                        confirmLoading={confirmLoading}
                        maskClosable={false}
                        destroyOnClose={destroyOnClose}
                        afterClose={afterClose}
                    >
                        <div style={{ maxHeight: maxHeight }}>
                            <Scrollbars autoHide autoHeight autoHeightMax={maxHeight} style={{ width: '100%' }}>
                                {this.props.children}
                            </Scrollbars>
                        </div>
                    </Modal>
                    <style jsx="true" global="true">
                        {`
                            .vertical-center-modal {
                                text-align: center;
                                white-space: nowrap;
                            }
                        
                            .vertical-center-modal:before {
                                content: '';
                                display: inline-block;
                                height: 100%;
                                vertical-align: middle;
                                width: 0;
                            }
                        
                            .vertical-center-modal .ant-modal {
                                display: inline-block;
                                vertical-align: middle;
                                top: 0;
                                text-align: left;
                            }
                        `}
                    </style>
                </div>
            );
        } else if (visible) {
            //如果footer为null，则不显示页脚按钮
            let buttons = [];
            if (footer != null && footer.length > 0) {
                let buttonKey = 0;
                for (let buttonParam of footer) {
                    //text：按钮描述，type：按钮类型，icon：按钮图标，loading：加载状态，onClick：按钮点击事件
                    let { text = "", type, icon = "", loading = false, onClick = () => { } ,disabled = false } = buttonParam;
                    let customButton = (
                        <Button key={buttonKey} type={type} icon={icon} loading={loading} onClick={onClick} disabled={disabled}>
                            {text}
                        </Button>
                    );
                    buttons.push(customButton);
                    buttonKey++;
                }

            } else {
                buttons = null;
            }

            return (
                <div>
                    <Modal
                        title={title}
                        style={style}
                        bodyStyle={bodyStyle}
                        visible={visible}
                        width={width}
                        footer={buttons}
                        onCancel={this.handleCancel}
                        wrapClassName="vertical-center-modal"
                        confirmLoading={confirmLoading}
                        maskClosable={false}
                        destroyOnClose={destroyOnClose}
                        afterClose={afterClose}
                    >
                        <div style={{ maxHeight: maxHeight }}>
                            <Scrollbars autoHide autoHeight autoHeightMax={maxHeight} style={{ width: '100%' }}>
                                {this.props.children}
                            </Scrollbars>
                        </div>
                    </Modal>
                    <style jsx="true" global="true">
                        {`
                            .vertical-center-modal {
                                text-align: center;
                                white-space: nowrap;
                            }
                        
                            .vertical-center-modal:before {
                                content: '';
                                display: inline-block;
                                height: 100%;
                                vertical-align: middle;
                                width: 0;
                            }
                        
                            .vertical-center-modal .ant-modal {
                                display: inline-block;
                                vertical-align: middle;
                                top: 0;
                                text-align: left;
                            }
                        `}
                    </style>
                </div>
            );
        } else {
            return null;
        }
    }
}

/**
 *  NHModal默认属性
 */
NHModal.defaultProps = {
    title: "标题",
    width: 520, //默认最小宽度
    maxSize: false, //是否最大化窗口
    destroyOnClose: true, //关闭时销毁 Modal 里的子元素
    onOk: () => {
    },
    onCancel: () => {
    },
    afterClose: () => {
    }
}

/**
 *  NHModal属性检查
 */
NHModal.propTypes = {
    title: PropTypes.string, //对话框标题
    style: PropTypes.object, //对话框样式
    bodyStyle: PropTypes.object, //Modal body 样式
    width: PropTypes.number,//宽度
    maxSize: PropTypes.bool,//最大化窗口
    footer: PropTypes.arrayOf(PropTypes.object),//按钮组
    destroyOnClose: PropTypes.bool,//关闭时销毁对话框内子元素
    onOk: PropTypes.func, //保存事件回调方法
    onCancel: PropTypes.func, //返回事件回调方法
    afterClose: PropTypes.func //Modal 完全关闭后的回调
}

//确认对话框
export function NHConfirm(pContent, pOnOk, pType, pOnCancel) {
    var content,type,onOk,onCancel;
    if ((typeof pContent) === 'string') {
        content = pContent ? pContent : '请填写内容描述';
        type = pType ? pType : 'normal';
        onOk = pOnOk ? pOnOk : () => {};
        onCancel = pOnCancel ? pOnCancel : () => {};
    } else {
        let params = pContent;
        content = params.content ? params.content : '请填写内容描述';
        type = params.type ? params.type : 'normal';
        onOk = params.onOk ? params.onOk : () => {};
        onCancel = params.onCancel ? params.onCancel : () => {};
    }

    const title = '提示';
    let okType = 'primary'; //默认确认按钮类型
    let iconType = 'question-circle'; //问号

    if (type === 'warn') { //警告类型操作提示

        okType = 'danger';
        iconType = 'info-circle';

    } else if (type === 'danger') { //危险类型操作提示

        okType = 'danger';
        iconType = 'exclamation-circle';

    }

    confirm({
        title: title,
        content: content,
        okText: '确定',
        cancelText: '取消',
        okType: okType,
        iconType: iconType,
        onOk() {
            onOk();
        },
        onCancel() {
            onCancel();
        },
    });
}

export default NHModal;
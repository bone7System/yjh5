import React from 'react';
import { Form } from 'antd';
import PropTypes from "prop-types";

const FormItem = Form.Item;

/**
 * 封装FormItem
 * Author: zengxiangkai@ly-sky.com
 * Created on: 2018-03-01 16:09:31
 * Version: 1.0
 * Modify log:
 *  2018-03-01：1、优化封装；2、添加自定义校验、支持多校验规则
 */
class NHFormItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {
            label, id, required, hasFeedback, form, colon, extra, formItemLayout, pattern,
            valuePropName, validator, validateTrigger, initialValue, showFlag
        } = this.props;
        const { getFieldDecorator } = form;

        //校验规则数组
        let rules = [];

        //如果是必填项
        if (required) {
            rules.push({
                required: required,
                message: label !== '' ? label + '不能为空！' : '该项不能为空！'
            });
        }

        //正则校验
        if (pattern) {
            rules.push(pattern);
        }

        //自定义校验
        if (validator) {
            rules.push({
                validator: validator
            });
        }

       
        //是否显示表单项，用于权限控制
        if (showFlag) {
           
            if (rules.length > 0) {
                return (
                    <FormItem {...formItemLayout}
                        label={label}
                        hasFeedback={hasFeedback}
                        colon={colon}
                        extra={extra}
                    >
                        {getFieldDecorator(id, {
                            valuePropName: valuePropName,
                            rules: rules,
                            initialValue: initialValue,
                            validateTrigger: validateTrigger
                        })(
                            this.props.children
                        )}
                    </FormItem>
                )
            } else if(!id){
                return (
                    <FormItem {...formItemLayout}
                        label={label}
                        colon={colon}
                        extra={extra}
                    >
                        {this.props.children}
                    </FormItem>
                )
            } else {
                return (
                    <FormItem {...formItemLayout}
                        label={label}
                        hasFeedback={hasFeedback}
                        colon={colon}
                        extra={extra}
                    >
                        {getFieldDecorator(id, {
                            valuePropName: valuePropName,
                            initialValue: initialValue,
                            validateTrigger: validateTrigger
                        })(
                            this.props.children
                        )}
                    </FormItem>
                )
            }
        } else {
            return null;
        }

    }
}

NHFormItem.defaultProps = {
    label: '',//标签的文本
    id: undefined,//输入控件唯一标志
    formItemLayout: {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
            md: { span: 7 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 10 },
        }
    },//表单项布局
    required: false,//是否必选
    valuePropName: 'value',//值属性名称
    hasFeedback: false,//展示校验状态图标
    colon: true,//配合 label 属性使用，表示是否显示 label 后面的冒号
    showFlag: true //是否显示表单项
}

/**
 * 属性类型检查
 */
NHFormItem.propTypes = {
    id: PropTypes.string.isRequired,//必填输入控件唯一标志，必需
    label: PropTypes.string, //字段标签，非必需
    required: PropTypes.bool,//是否必填，非必需
    hasFeedback: PropTypes.bool,//展示校验状态图标，非必需
    form: PropTypes.object.isRequired, //this.props.form，必需
    colon: PropTypes.bool,//是否显示 label 后面的冒号，非必需
    extra: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),//额外的提示信息,一般不需要，非必需
    formItemLayout: PropTypes.object,//自定义的布局，非必需
    initialValue: PropTypes.any, //初始值
    pattern: PropTypes.object,//常用正则验证或额外验证，非必需
    valuePropName: PropTypes.string, //表单项值属性，非必需
    validator: PropTypes.func, //自定义校验方法，非必需
    validateTrigger: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]), //表单项自定义校验时机，非必需
    showFlag: PropTypes.bool //是否显示表单项，非必需
}

export default NHFormItem;
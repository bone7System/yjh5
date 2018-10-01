import React from 'react';
import { Cascader } from 'antd';
import NHFetch from '../../utils/NHFetch';
import PropTypes from 'prop-types';

const pathUrl = "/proData/selectCascaderList";

class NHCascader extends React.Component {

    constructor(props) {
        super(props)
        const value = this.props.value || [];
        this.state = {
            options: [],
            value: value,
        }
    }

    //初始加载第一级级联下拉数据
    componentDidMount() {
        const level = 1;
        const cascaderValue = '';
        this.getInitData(level, cascaderValue);
    }

    componentWillReceiveProps(nextProps) {

        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({ value: value });
        }
    }

    //获取初始化数据
    getInitData = (level, cascaderValue, parentOption) => {
        const { sign } = this.props;

        let params = { level: level, sign: sign, cascaderValue: cascaderValue };

        NHFetch(pathUrl, 'GET', params)
            .then(res => {
                if (res) {
                    let data = res.data;
                    if (data) {
                        if (parentOption) {
                            parentOption.loading = false;
                            parentOption.children = data;
                            this.setState({
                                options: [...this.state.options],
                            });
                        } else {
                            this.setState({
                                options: data,
                            });
                        }

                        //获取初始值，判断是否需要加载下一级级联数据
                        let initValue = this.props.value;
                        if (initValue && initValue.length > 0) {
                            let targetOption = data.filter(item => item.value == initValue[level - 1])[0];
                            if (targetOption) {
                                targetOption.loading = true;
                                if (level < initValue.length) {
                                    this.getInitData(level + 1, initValue[level - 1], targetOption);
                                }
                            }
                        }
                    } else {
                        this.setState({ options: [] });
                    }
                }
            });
    }


    //当选择父项时，动态加载子项数据
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        let level = parseInt(targetOption.currLevel) + 1;
        let cascaderValue = targetOption.value;
        this.getCascaderData(level, cascaderValue, targetOption);
    }

    //从后台查询级联下拉数据
    getCascaderData = (level, cascaderValue, targetOption) => {

        const { sign } = this.props;

        let params = { level: level, sign: sign, cascaderValue: cascaderValue };

        NHFetch(pathUrl, 'GET', params)
            .then(res => {
                if (res) {
                    if (res.data) {
                        if (targetOption) {
                            targetOption.loading = false;
                            targetOption.children = res.data;
                            this.setState({
                                options: [...this.state.options],
                            });
                        } else {
                            this.setState({
                                options: [...res.data],
                            });
                        }
                    } else {
                        this.setState({ options: [] });
                    }
                }
            });
    }

    //级联选择框值变化时回调
    handleCascaderChange = (value, selectedOptions) => {

        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        this.triggerChange(value);
    }

    //提供onChange回调方法给Form表单，表明这是一个自定义表单受控组件
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    }

    render() {

        const { options, value } = this.state;
        const { style, placeholder, disabled, defaultValue, changeOnSelect, onChange } = this.props;

        return (
            <Cascader
                options={options}
                loadData={this.loadData}
                onChange={this.handleCascaderChange}
                changeOnSelect={changeOnSelect}
                style={style}
                placeholder={placeholder}
                value={value}
                notFoundContent={'无数据'}
            />
        )
    }
}

//默认属性值
NHCascader.defaultProps = {
    sign: '', //数据源标识
    placeholder: '请选择...', //输入框占位文本
    disabled: false, //是否禁用
    changeOnSelect: true, //当此项为 true 时，点选每级菜单选项值都会发生变化
}

//属性检查
NHCascader.propTypes = {
    sign: PropTypes.string.isRequired, //数据源标识
    style: PropTypes.object, //样式
    placeholder: PropTypes.string, //输入框占位文本
    disabled: PropTypes.bool, //是否禁用
    defaultValue: PropTypes.any, //默认选中项
    value: PropTypes.any, //初始值
    changeOnSelect: PropTypes.bool, //当此项为 true 时，点选每级菜单选项值都会发生变化
    onChange: PropTypes.func, //选择完成后的回调
}

export default NHCascader;

import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import NHFetch from '../../utils/NHFetch';
const Option = Select.Option;

class NHMultiSelect extends React.Component {

    constructor(props) {
        super(props)
        const value = this.props.value || [];
        this.state = {
            data: [],
            value: value || []
        }

    }

    componentDidMount() {
        const { sign, dataSource } = this.props;

        //如果是使用数据源标识，则优先加载远程数据
        if (sign && sign != '') {
            this.loadRemoteData(sign);
        } else {
            //如果没有使用远程数据，则加载本地数据
            this.loadLocalData();
        }
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({ value: value });
        }

        //为了防止在使用本地数据源的时候，在上级组件使用异步请求，导致在componentDidMount阶段未能获取到返回的dataSource
        if ('dataSource' in nextProps) {
            const dataSource = nextProps.dataSource;
            this.setState({ data: dataSource });
        }
    }

    //加载远程数据
    loadRemoteData = (sign) => {
        NHFetch("/proData/selectDataList", 'POST', { sign: sign ,params:this.props.params,sqlParams:this.props.sqlParams})
            .then(res => {
                if (res) {
                    this.parseData(res.data);
                }
            });
    }

    //加载本地数据
    loadLocalData = () => {
        if (this.props.dataSource) {
            this.setState({ data: this.props.dataSource });
        }
    }

    //解析数据
    parseData = (data) => {
        if (data) {
            this.setState({ data: data });
        } else {
            //如果远程数据为空，则尝试加载本地数据源
            this.loadLocalData();
        }
    }

    //下拉选项选中时回调
    handleSelect = (value, option) => {

        let label = option.props.children;

        const onSelect = this.props.onSelect;
        if (onSelect) {
            onSelect(value, label, option);
        }

    }

    //下拉选择器input value值变化时回调
    handleChange = (value, option) => {

        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        this.triggerChange(value);
    }

    //取消选中时调用
    handleDeselect = (value) => {

        // const values = [...this.state.value];
        const values = this.state.value;
        const target = values.filter(item => item != value);

        if (!('value' in this.props)) {
            this.setState({
                value: target
            });
        }

        const onDeselect = this.props.onDeselect;

        if (onDeselect) {
            onDeselect(value);
        }

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

        const { style, placeholder, disabled, defaultValue, filterData } = this.props;
        const { value, data } = this.state;
        let options = [];

        //如果有过滤条件
        if (filterData) {

            const { type, filterkeys = [] } = filterData;

            switch (type) {
                //过滤掉指定key值
                case 'remove': {
                    const newData = data.filter(item => {
                        if (filterkeys.find((key) => (item.VALUE || item.value) == key)) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                    options = newData.map(option => <Option key={option.VALUE || option.value} value={option.VALUE || option.value}>{option.LABEL || option.label}</Option>);
                    break;
                }
                //保留指定key值
                case 'save': {
                    const newData = data.filter(item => {
                        if (filterkeys.find((key) => (item.VALUE || item.value) == key)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    options = newData.map(option => <Option key={option.VALUE || option.value} value={option.VALUE || option.value}>{option.LABEL || option.label}</Option>);
                    break;
                }
                //未找到指定过滤类型，则不做过滤
                default: {
                    options = data.map(option => <Option key={option.VALUE || option.value} value={option.VALUE || option.value}>{option.LABEL || option.label}</Option>);
                    break;
                }
            }

        } else {

            options = data.map(option => <Option key={option.VALUE || option.value} value={option.VALUE || option.value}>{option.LABEL || option.label}</Option>);

        }

        return (
            <div>
                <Select
                    allowClear
                    style={style}
                    mode={"multiple"}
                    defaultValue={defaultValue}
                    value={value}
                    onSelect={this.handleSelect}
                    onChange={this.handleChange}
                    onDeselect={this.handleDeselect}
                    placeholder={placeholder}
                    notFoundContent={"无数据"}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    disabled={disabled}
                >
                    {options}
                </Select>
            </div>
        )
    }
}

//属性默认值
NHMultiSelect.defaultProps = {
    placeholder: '请选择...',
    disabled: false,
}

//属性检查
NHMultiSelect.propTypes = {
    sign: PropTypes.string, //数据源标识
    // dataSource: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         value: PropTypes.object,
    //         label: PropTypes.node
    //     })
    // ), //本地数据源
    style: PropTypes.object, //样式
    placeholder: PropTypes.string, //下拉提示
    disabled: PropTypes.bool, //是否禁用
    // defaultValue: PropTypes.arrayOf(PropTypes.object), //默认值
    // value: PropTypes.arrayOf(PropTypes.object), //初始值
    filterData: PropTypes.shape({
        type: PropTypes.oneOf(['remove', 'save']), //是保留还是过滤掉
        filterkeys: PropTypes.array //保留或过滤的key值
    }), //要过滤掉的Key值
    onSelect: PropTypes.func,//下拉选项选中时回调
    onChange: PropTypes.func,//多选框值变化时回调
    onDeselect: PropTypes.func,//多选框值删除时回调
    params: PropTypes.object, //过滤条件
    sqlParams: PropTypes.object //sql语句内的过滤参数
}

export default NHMultiSelect;

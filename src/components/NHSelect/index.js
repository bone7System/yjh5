import React from "react";
import { Select, Modal } from 'antd';
import PropTypes from 'prop-types';
import NHFetch from "../../utils/NHFetch";
import {createUuid} from '../../utils/NHCore';

const pathUrl = "/proData/selectDataList";
const Option = Select.Option;

/**
 * 下拉选择器
 * 1、符合自定义表单组件规范，结合FormItem使用时不会出现警告信息
 * 2、使用sign属性时，后台对应sign标识的sql查询语句列必须以value、label作为别名
 * Author: zengxiangkai@ly-sky.com
 * Created on: 2018-03-29 18:00:31
 * Version: 1.3
 * Modify log:
 * 2018-04-18
 *      1、新增filterData属性，该属性可以过滤（或保留）指定keys值项
 * 2018-04-20
 *      2、新增dataSource属性，允许使用固定的数据源构造下拉数据，数据源格式为[{value:'value',label:'label'},{},...]
 * 2018-06-04
 *      3、解决sign为空或空字符串的时候，请求后台数据源报错问题
 */
class NHSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            value: this.props.value
        }
    }

    componentDidMount() {

        const { sign, dataSource , url } = this.props;

        //如果是使用数据源标识，则优先加载远程数据
        if (sign || url) {
            this.loadRemoteData(sign , url);
        } else {
            //如果没有使用远程数据，则加载本地数据
            this.loadLocalData();
        }
    }

    componentWillReceiveProps(nextProps) {
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
    loadRemoteData = (sign,url) => {
        let toUrl=url?url:pathUrl;
        NHFetch(toUrl, 'GET', { sign: sign })
            .then(res => {
                if (res) {
                    this.parseData(res.data);
                }
            });
    }

    //加载本地数据
    loadLocalData = () => {
        if (this.props.dataSource) {
            let nullOption = [{ value: '', label: '请选择...' }];
            this.setState({ data: [...nullOption, ...this.props.dataSource] });
        }
    }

    //解析数据
    parseData = (data) => {
        if (data) {
            let nullOption = [{ value: '', label: '请选择...' }];
            this.setState({ data: [...nullOption, ...data] });
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

        this.triggerChange(value,option.props.children);
    }

    //提供onChange回调方法给Form表单，表明这是一个自定义表单受控组件
    triggerChange = (changedValue,changeText) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue,changeText);
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
                    style={style}
                    showSearch
                    defaultValue={defaultValue}
                    value={value}
                    onSelect={this.handleSelect}
                    onChange={this.handleChange}
                    placeholder={placeholder}
                    notFoundContent={"无数据"}
                    disabled={disabled}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {options}
                </Select>
            </div>
        )
    }
}

//属性默认值
NHSelect.defaultProps = {
    placeholder: '请选择...',
    disabled: false,
    value:''
}

//属性检查
NHSelect.propTypes = {
    sign: PropTypes.string, //远程数据源标识
    url: PropTypes.string, //自定义查询数据
    dataSource: PropTypes.arrayOf(
        PropTypes.shape({
            // value: PropTypes.string,
            label: PropTypes.node
        })
    ), //本地数据源
    style: PropTypes.object, //样式
    placeholder: PropTypes.string, //下拉提示
    disabled: PropTypes.bool, //是否禁用
    defaultValue: PropTypes.string, //默认值
    // value: PropTypes.string, //初始值
    filterData: PropTypes.shape({
        type: PropTypes.oneOf(['remove', 'save']), //是保留还是过滤掉
        filterkeys: PropTypes.array //保留或过滤的key值
    }), //要过滤掉的Key值
    onSelect: PropTypes.func,//下拉选项选中时回调
    onChange: PropTypes.func,//下拉框值变化时回调
}


export default NHSelect;
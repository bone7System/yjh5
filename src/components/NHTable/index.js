import React from 'react';
import { Table, Input, Button, Icon, Row, Col, Modal, Select, Checkbox, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { getSuitHeight, createUuid, getStyle , getLoginUser } from '../../utils/NHCore';
import { baseUrl } from '../../utils/NHPrefixUrl';
import styles from './style.css';
import Action from './action.js';
import ExpExcel from './expexcel.js';

import NHFetch from "../../utils/NHFetch";
import NHModal from '../NHModal/index';

const Search = Input.Search;
let loadCount=0;

class NHTable extends React.Component {
    //设置可以传递参数的默认值
    static defaultProps = {
        sign: undefined,//【强制存在】数据源的标志
        rowKey: undefined, //【推荐存在】设置的rowKey,在selectedRowKeys中存放的数据就是这个字段的值
        searchParams: {},//【推荐存在】查询条件的参数
        sqlParams: {},//【根据需求判断】放在sql语句语句中的参数
        initParams: {},//初始化过滤的参数，这个不会根据重置而改变
        checkbox: true, //【根据需求判断】是否需要checkbox
        autoHeightFlag: false,//【根据需求判断】是否根据内容自适应高度，默认为false,表示高度固定
        height: undefined,//【根据需求判断】自定义的高度
        footerFlag: true,//【根据需求判断】是否需要尾部，不需要尾部的时候，不会进行分页,
        tip: undefined, //【根据需求判断】是否需要提示信息
        searchDivFlag: true,//【根据需求判断】是否需要自带查询操作，默认需要
        onSelect: undefined,
        defaultExpandAllRows: false,//初始时，是否展开所有行
        defaultExpandedRowKeys: undefined,//默认展开的行
        expandedRowRender: undefined,//展开行的回调方法认展开的行
        action: [],
        bordered: true,//是否展示外边框和列边框
        titleHeight: 40,//Title头部的高度，这个主要是为了解决出现多级表头的时候，高度计算会出现问题
        showHeader: true,//是否显示头部
        url: undefined,//后台访问地址，传了此路径就表示后台查询使用此路径而不是使用通用路径
        rangeFilter: false, //是否开启职务范围过滤
        isDefaultLoadData: true ,//是否默认加载数据，如果此参数为false,则默认不会加载数据,且此时显示加载中，这个主要是为了在当前模块还需要去后台查询初始化参数时，会出现开始就查询两次的情况
    };
    constructor(props) {
        super(props)
        this.state = {
            // columns: this.props.columns,
            filterDropdownVisibleMap: {},
            searchParams: this.props.searchParams,//自定义的搜索条件
            searchTextMap: {},//下拉框查询的值,用作查询
            filters: {},//多选方式过滤的值
            sorter: {},//排序字段
            selectedRows: [],//选中的数据
            selectedRowKeys: [],//选中的数据的主键loading
            loading: false,
            data: [],//数据
            pageData: {//分页设置的是三个参数
                total: 0,
                pageSize: (this.props.footerFlag === false ? 10000000 : 20),//当前页默认多少条数据
                page: 0
            },
            height: this.props.autoHeightFlag===true?undefined:this.props.height, //列表的高度
            width: undefined,//列表的宽度
            className: createUuid(),
            tySearchAllField: '',//通用查询的所有字段
            searchText: '',//通用查询的值
            searchField: '',//通用查询的字段
        }
    }
    //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    UNSAFE_componentWillMount() {
        if(this.props.isDefaultLoadData!==false){
            this.filterTableData();
        }
        //循环判断哪些字段需要通用查询的搜索条件
        if (this.props.searchDivFlag !== false) {
            let tySearchAllField = "multiField";//自定义查询的所有字段
            this.props.columns.map((item, index) => {
                if (item.commonSearch !== false && item.title != '序号' && item.title != '操作') {
                    tySearchAllField += "," + item.dataIndex;
                }
            });
            this.setState({
                tySearchAllField: tySearchAllField,
                searchField: tySearchAllField
            });
        }
    }
    //在组件挂载之后调用一次。
    componentDidMount() {
        this.refreshHeight();
    }

    componentDidUpdate() {
        this.refreshHeight();
    }
    refreshHeight = () => {
        //如果需要自适应高度
        if (!this.props.autoHeightFlag && document.getElementsByClassName(this.state.className)) {
            let lastHeight = this.state.height;
            let height = getSuitHeight(document.getElementsByClassName(this.state.className)[0]);
            let titleHeight = (this.props.titleHeight || this.props.titleHeight === 0) ? this.props.titleHeight : 40;
            //如果不显示头部，则头部的高度为0
            if (this.props.showHeader !== true) { titleHeight = 0; }
            let reduceHeight = 40 + titleHeight;
            if (this.props.footerFlag === false) {
                reduceHeight = 5 + titleHeight;
            }
            height = height - reduceHeight;
            // alert(height);
            if (!lastHeight || lastHeight != height) {
                this.setState({
                    height: height
                });
            }
        }
    }


    //固定通用方法
    //搜索操作
    onSearch = () => {
        this.filterTableData();
    }
    //重置操作
    onRest = () => {
        this.setState((prevState, props) => ({
            searchParams: {},//自定义的搜索条件
            searchTextMap: {},//下拉框查询的值,用作查询
            searchText: '',
            searchField: this.state.tySearchAllField,
            filters: {},//多选方式过滤的值
            sorter: {},//排序字段
            selectedRows: [],//选中的数据
            selectedRowKeys: [],//选中的数据的主键loading
            pageData: {
                total: this.state.pageData.total,
                pageSize: this.state.pageData.pageSize,
                page: 0
            }
        }), function () {
            this.filterTableData();
        });
    }



    //搜索栏数据框值改变的时候执行的操作
    onInputChange = (e) => {
        let key = e.target.name.split("-")[0];
        let searchTextMap = this.state.searchTextMap;
        searchTextMap[key] = e.target.value;
        this.setState({ searchTextMap: searchTextMap });
    };
    //重新加载数据数据的方法（从第一页开始）
    filterTableData = () => {
        this.setState((prevState, props) => ({
            pageData: {
                total: this.state.pageData.total,
                pageSize: this.state.pageData.pageSize,
                page: 0
            }
        }));
        this.readTableData();
    }
    //在当前页刷新数据
    readTableData = () => {
        let params = this.getFilterParams();
        this.setState({ loading: true })
        let url = this.props.url ? this.props.url : "/proData/gridList";
        NHFetch(url, "POST", params)
            .then(res => {
                if (res) {
                    this.setState({
                        data: res.data.content,
                        selectedRowKeys: [],
                        selectedRows: [],
                        pageData: {
                            total: res.data.totalElements,
                            pageSize: this.state.pageData.pageSize,
                            page: this.state.pageData.page
                        }
                    })
                }
                this.setState({ loading: false })
            }).catch((res) => {
                this.setState({ loading: false })
                return res;
            });
    }

    getFilterParams = () => {
        let pagination = this.state.pageData;//分页的参数
        let filters = this.state.filters;//多选过滤的数据
        let sorter = this.state.sorter;//过滤的数据
        let searchTextMap = this.state.searchTextMap;//字段上搜索栏的值
        let searchParams = this.state.searchParams;//传递过来的查询参数
        let sqlParams = this.props.sqlParams;//在sql语句中的参数
        let initParams = this.props.initParams;//初始化参数
        let rangeFilter = this.props.rangeFilter; //是否根据职务范围过滤

        if (!searchParams) { searchParams = {}; }
        //对里面可能存在的参数值为sql语句进行处理
        searchParams = this.encodeSql(searchParams);
        sqlParams = this.encodeSql(sqlParams);
        initParams = this.encodeSql(initParams);

        let params = {
            pagination: pagination,
            filters: filters,
            sorter: sorter,
            searchTextMap: searchTextMap,
            searchParams: searchParams,
            sqlParams: sqlParams,
            initParams: initParams,
            sign: this.props.sign
        };

        //如果启用职位范围过滤
        if (rangeFilter) {
            let userId = getLoginUser() ? getLoginUser().userId : '';
            params.rangeFilter = { id: userId };
        }
        return params;
    }
    //当Table有变动的时候会触发此方法
    handleTableChange = (pagination, filters, sorter) => {
        this.setState((prevState, props) => ({
            //filters:filters,
            sorter: {
                columnKey: sorter.columnKey,
                order: sorter.order
            },
            pageData: {
                total: this.state.pageData.total,
                pageSize: pagination.pageSize,
                page: pagination.current
            }
        }), function () {
            this.readTableData();
        });
    }
    //导出Excel
    exportExcel = (excelName) => {
        this.setState({ excelName: excelName });
        this.refs.nhExportExcelModal.show();
    }

    //执行导出Excel操作
    handleExportExcel = (stopLoading) => {
        let params = this.getFilterParams();
        let columns = this.refs.nhExpExcel.state.targetKeys;
        let excelName = this.refs.nhExpExcel.state.excelName;
        if (!columns || columns.length <= 0) {
            message.info("请选择需要导出的列！");
            stopLoading();
            return;
        }
        if (!excelName) {
            message.info("文件名不能为空");
            stopLoading();
            return;
        }
        let columnsMap = {};
        for (let i = 0; i < columns.length; i++) {
            let c = columns[i].split("@");
            columnsMap[c[0]] = c[1];
        }
        let total = this.state.pageData.total;
        if(total<40000) {
            NHFetch("/proData/gridList/excel/params", "POST", { params: params, columnsMap: columnsMap, excelName: excelName })
            .then(res => {
                if (res) {
                    if (!res.data) {
                        message.info("请刷新浏览器，重新再执行此操作！");
                        return;
                    }
                    // 本地
                    window.open("api/proData/gridList/excel/export?uuid=" + res.data, "_blank");
                }
                stopLoading();
            }).catch(err => stopLoading());
        }else {
            message.error("所选择数据量过大，无法导出！");
            stopLoading();
            return;
        }

    }

    //高级查询
    highSeatch = () => {
        alert("高级查询");
    }


    encodeSql = (params) => {
        for (let key in params) {
            if (key.toUpperCase().startsWith('SQL_') && params[key]) {
                // params[key] = encode(params[key]);
                params[key] = params[key]
            } else if (key.toUpperCase().startsWith('G_') && params[key]) {
                params[key] = this.encodeSql(params[key]);
            }
        }
        return params;
    }

    zdySearchTextChange = (e) => {
        this.setState({
            searchText: e.target.value
        });
        if (e.target.value && this.state.searchField) {
            let searchParams = {};
            searchParams[this.state.searchField] = e.target.value;
            this.setState({
                searchParams: searchParams
            });
        } else {
            this.setState({
                searchParams: {}
            })
        }
    }

    zdySearchFieldChange = (value) => {
        this.setState({
            searchField: value
        });
        if (value && this.state.searchText) {
            let searchText = this.state.searchText;
            let searchParams = {};
            searchParams[value] = searchText;
            this.setState({
                searchParams: searchParams
            })
        } else {
            this.setState({
                searchParams: {}
            })
        }
    }


    //表头搜索-Checkbox改变时触发的事件
    handleCheckboxChange = (key, value) => {
        let values = [];
        for (let key in value) {
            values.push(value[key]);
        }
        let filters = this.state.filters;
        if (!filters) { filters = {} }
        filters[key] = values;
        this.setState({
            filters: filters
        }, () => {
            this.filterTableData();
        });
    }
    //表头搜索-重置按钮点击时触发的事件
    handleCheckboxClear = (key) => {
        let filters = this.state.filters;
        if (filters) {
            delete filters[key];
            this.setState({
                filters: filters
            }, () => {
                this.filterTableData();
            });
        }
    }


    components = {
        table:(props) => <Scrollbars onScroll={this.onScroll} autoHide style={{ width: '100%', height: this.state.height }}><table {...props} ></table></Scrollbars>,
    }

   
    onScroll = (e1) => {
        if(loadCount==0){
            let scrollLeft=e1.target.scrollLeft;
            let scrollTop=e1.target.scrollTop;
            let $parentObj=e1.target.parentNode.parentNode;
            let obj=$parentObj.classList.contains('ant-table-body')?'content':'none';
            if(obj == 'none'){
                obj=$parentObj.parentNode.parentNode.classList.contains('ant-table-fixed-left')?'left':'right';
            }
            // console.info(obj);
    
            //头部对象
            let $table = document.getElementsByClassName(this.state.className)[0];
            let $header = $table.getElementsByClassName("ant-table-scroll")[0].getElementsByClassName("ant-table-header")[0];
            $header.scrollLeft=scrollLeft;
            //中间内容区
            let $content = $table.getElementsByClassName("ant-table-scroll")[0].getElementsByClassName("ant-table-body")[0].childNodes[0].childNodes[0];
            // console.info($content.scrollTop);
            if(obj!='content' && $content.scrollTop!=scrollTop){
                // console.info("中间内容区调用");
                loadCount++;
                $content.scrollTop=scrollTop;
            }
            //左部固定内容区
            if($table.getElementsByClassName("ant-table-fixed-left")[0]){
                let $left = $table.getElementsByClassName("ant-table-fixed-left")[0].getElementsByClassName("ant-table-body-inner")[0].childNodes[0].childNodes[0];
                if($left && obj!='left' && $left.scrollTop!=scrollTop){
                    // console.info("左边内容区调用");
                    loadCount++;
                    $left.scrollTop=scrollTop;
                }
            }
            //右部固定内容区
            if($table.getElementsByClassName("ant-table-fixed-right")[0]){
                let $right = $table.getElementsByClassName("ant-table-fixed-right")[0].getElementsByClassName("ant-table-body-inner")[0].childNodes[0].childNodes[0];
                if($right && obj!='right' && $right.scrollTop!=scrollTop){
                    // console.info("右边内容区调用");
                    loadCount++;
                    $right.scrollTop=scrollTop;
                }
            }
        }else{
            loadCount--;
        }
    }


    render() {
        function deepCopy(obj) {
            if (typeof obj != 'object') {
                return obj;
            }
            var newobj = {};
            for (var attr in obj) {
                newobj[attr] = deepCopy(obj[attr]);
            }
            return newobj;
        }
        /****************************以下操作是初始化列的数据*********************************/
        let columns = []
        let minWidthCount = 0;//最小宽度列（只有最小宽度这个参数）
        let minAllWidth = 0;//最小宽度列宽度之和
        let fieldCount = 0;//除开序号列和参数列的列数之和
        let fieldAllWidth = 0;//除开序号列和参数列的宽度之和
        this.props.columns.map((item1) => {
            let item = deepCopy(item1);
            if (item.hidden !== true) {
                if (!item.dataIndex && item.key) {
                    item.dataIndex = item.key;
                }
                if (!item.dataIndex) {
                    alert("dataIndex不能为空");
                }
                //dataIndex必须大写
                // item.dataIndex = item.dataIndex.toUpperCase();
                //列width或者minWidth必须至少设置一个
                if (!item.width && !item.minWidth) {
                    alert("参数设置有误，width和minWidth必须设置一个！");
                    return;
                }
                //如果列的最小宽度不存在，则设置width为最小宽度
                if (!item.minWidth) {
                    item.minWidth = item.width;
                }
                //项缓存冻结列的数据，因为当列的宽度总和小于列表宽度的时候不需要是使用冻结列的
                if (item.fixed && item.fixed == 'left') {
                    item.cacheFixed = 'left';
                } else if (item.fixed && item.fixed == 'right') {
                    item.cacheFixed = 'right';
                }
                delete item.fixed;
                //获取一些数据给下面使用
                if (item.dataIndex.toUpperCase() !== 'ROW_ID') {
                    fieldCount++;
                    fieldAllWidth += parseInt(item.minWidth);
                }
                if (!item.width) {
                    minWidthCount++;
                    minAllWidth += parseInt(item.minWidth);
                }
                columns.push(item);
            }
        });
        /****************************以下操作是添加操作列*********************************/
        if (this.props.action && this.props.action.length > 0) {
            let action1 = this.props.action;
            let action = [];
            //根据权限过滤掉没有权限的操作
            action1.map((item, index) => {
                action.push(item);
            });
            if (action.length > 0) {
                let actionWidth = 0;
                if (action.length == 1) {
                    actionWidth = 20 + action[0].title.length * 15;
                } else if (action.length == 2) {
                    actionWidth = 35 + action[0].title.length * 15 + action[1].title.length * 15;
                } else {
                    actionWidth = 85 + action[0].title.length * 15;
                }
                columns.push({
                    title: '操作',
                    width: actionWidth + 'px',
                    minWidth: actionWidth + 'px',
                    cacheFixed: 'right',
                    dataIndex: 'ACTION',
                    key: 'ACTION',
                    render: (text, record, index) => {
                        return (<Action action={action} record={record} key={index}></Action>)
                    }
                })
            }
        }
        /****************************以下操作是列的宽度，并做处理*********************************/
        var width = 0;
        //获取对象的宽度，如果当前对象宽度为0，表明此对象是被隐藏了，此时需要获取他父级的宽度
        function getWidth(width, obj) {
            if (width <= 0) {
                const paddintLeft = getStyle(obj.parentNode, "paddingLeft") ? getStyle(obj.parentNode, "paddingLeft") : 0;
                const paddingRight = getStyle(obj.parentNode, "paddingRight") ? getStyle(obj.parentNode, "paddingRight") : 0;
                const borderLeft = getStyle(obj.parentNode, "borderLeftWidth") ? getStyle(obj.parentNode, "borderLeftWidth") : 0;
                const borderRight = getStyle(obj.parentNode, "borderRightWidth") ? getStyle(obj.parentNode, "borderRightWidth") : 0;
                width = obj.parentNode.clientWidth - parseInt(paddintLeft) - parseInt(paddingRight) - parseInt(borderLeft) - parseInt(borderRight);
                if (obj.className.includes('ant-table-expanded-row')) {
                    //如果为二级列表，则需要减去第一个TD的宽度
                    width = (width - 50) * 0.98;
                }
                return getWidth(width, obj.parentNode);
            }
            return width;
        }
        if (document.getElementsByClassName(this.state.className)[0]) {
            //存在二级列表时候的+号列50
            const expandWidth = this.props.expandedRowRender === undefined ? 0 : 50;
            //滚动条宽度20
            // const scollWidth = this.props.autoHeightFlag === true ? 0 : 20;
            const scollWidth = 0;//使用优化后的滚动条，宽度为0
            //选择框列63
            const selectFieldWidth = this.props.checkbox === true ? 63 : 0;
            //列表的宽度
            let tableWidth = document.getElementsByClassName(this.state.className)[0].offsetWidth;
            tableWidth = getWidth(tableWidth, document.getElementsByClassName(this.state.className)[0]);
            //列的实际宽度
            let trueWidth = scollWidth + selectFieldWidth + expandWidth;
            columns.map((item, index) => {
                trueWidth += parseInt(item.minWidth);
            });
            //如果列的宽度大于列表的宽度的时候，需要冻结列，减少10px是为了减少误差
            if (trueWidth > (tableWidth - 10)) {
                columns.map((item, index) => {
                    item.width = parseInt(item.minWidth);
                    if (item.cacheFixed) {
                        item.fixed = item.cacheFixed;
                    }
                });
                width = trueWidth + 10;
            } else if (trueWidth == (tableWidth - 10)) {//如果列的宽度等于列表的宽度的时候，不需要做任何的处理
                columns.map((item, index) => {
                    item.width = parseInt(item.minWidth);
                });
            } else {//如果列的宽度小于列表的宽度的时候，存在最小宽度列，则把剩余宽度平分到最小宽度列，如果没有，则平分到除了序号和操作列的其他列
                const elseWidth = tableWidth - 10 - trueWidth;
                if (minWidthCount == 0) {//没有扩展列
                    columns.map((item, index) => {
                        if (item.dataIndex && item.dataIndex !== 'ROW_ID' && item.dataIndex !== 'ACTION') {
                            item.width = parseInt(item.minWidth) + parseInt(elseWidth * parseInt(item.minWidth) / fieldAllWidth);
                        }
                    });
                } else {
                    columns.map((item, index) => {
                        if (!item.width) {//最小宽度列
                            item.width = parseInt(item.minWidth) + parseInt(elseWidth * parseInt(item.minWidth) / minAllWidth);
                        }
                    });
                }
            }
        }

        /****************************以下部分页的参数,如果不需要尾部则这些信息不需要进行设置*********************************/
        if (this.props.footerFlag !== false) {
            var Pagination = {
                total: this.state.pageData.total,//数据总数
                pageSize: this.state.pageData.pageSize,//每页的条数
                current: this.state.pageData.page+1,//当前页数
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条 总数${total}条`,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100', '200', '500']
            };
        } else {
            var Pagination = false;
        }

        /****************************以下是设置是否需要选择框*********************************/
        if (this.props.checkbox !== false) {
            var rowSelection = {
                type: 'checkbox',
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                        selectedRows: selectedRows,
                        selectedRowKeys: selectedRowKeys
                    });
                    this.props.rowSelectionChange && this.props.rowSelectionChange(selectedRowKeys);
                    this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);
                }
            }
        }
        /****************************行选中事件*********************************/
        let onRow = (record,index) => {
            return {
              onClick: (e3) => {
                    let selectedRowKeys=this.state.selectedRowKeys;
                    let selectedRows=this.state.selectedRows;   
                    let key='';
                    if(this.props.rowKey instanceof Function){
                        key=this.props.rowKey(record);
                    }else{
                        key=record[this.props.rowKey];
                    }
                    let isAdd=true;//默认是新增
                    for(let i=0;i<selectedRowKeys.length;i++){
                        if(selectedRowKeys[i]==key){//存在说明是删除
                            selectedRowKeys.splice(i,1);
                            selectedRows.splice(i,1);
                            isAdd=false;
                            break;
                        }
                    }
                    if(isAdd){
                        selectedRowKeys.push(key);
                        selectedRows.push(record);
                    }
                    this.setState({
                        selectedRows: selectedRows,
                        selectedRowKeys: selectedRowKeys
                    });

                    this.props.rowSelectionChange && this.props.rowSelectionChange(selectedRowKeys);
                    this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);
              },      
            };
          }
        /****************************以下是循环判断是否需要排序、搜索条件*********************************/
        columns.map((item, index) => {
            if (!item.key) {
                item.key = item.dataIndex;
            }

            //是否需要排序
            if (item.sorted !== false && item.title !== '序号' && item.title != '操作') {
                item.sorter = true;
            } else {
                item.sorter = false;
            }
            //多选过滤
            if (item.filters) {
                let filters = deepCopy(item.filters);
                let checkboxList = [];
                for (var key in filters) {
                    checkboxList.push(<div key={createUuid()}><Checkbox value={filters[key].value} >{filters[key].text}</Checkbox></div>);
                }
                item.filterDropdownVisible = this.state.filterDropdownVisibleMap[item.key];
                item.filterDropdown = (
                    <div style={{ padding: '8px', borderRadius: '6px', background: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)' }}>
                        <Checkbox.Group style={{ width: '100%' }} onChange={(values) => { this.handleCheckboxChange(item.key, values) }} value={this.state.filters[item.key]}>
                            {checkboxList}
                        </Checkbox.Group>
                        <div style={{ borderTop: '1px solid grey', marginTop: '5px', height: '25px', padding: '5px 5px 0px 5px' }}>
                            <a style={{ float: 'right' }} onClick={() => { this.handleCheckboxClear(item.key) }}>重置</a>
                        </div>
                    </div>
                );
                item.onFilterDropdownVisibleChange = (visible) => {
                    let filterDropdownVisibleMap = this.state.filterDropdownVisibleMap;
                    filterDropdownVisibleMap[item.key] = visible;
                    this.setState({
                        filterDropdownVisibleMap: filterDropdownVisibleMap,
                    });
                }
                delete item.filters;
            }
            //搜索-输入框
            else if (item.search && item.search === 'input') {
                let name = item.key + "-tableSearchInput";
                item.filterDropdownVisible = this.state.filterDropdownVisibleMap[item.key];
                item.filterDropdown = (
                    <div style={{ padding: '8px', borderRadius: '6px', background: '#fff', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)' }}>
                        <Input style={{ width: '130px', marginRight: '8px' }}
                            ref={ele => this.searchInput = ele}
                            name={name}
                            placeholder="请输入查询条件"
                            value={this.state.searchTextMap[item.key]}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" icon="search" onClick={this.onSearch}></Button>
                    </div>
                );
                item.onFilterDropdownVisibleChange = (visible) => {
                    let filterDropdownVisibleMap = this.state.filterDropdownVisibleMap;
                    filterDropdownVisibleMap[item.key] = visible;
                    this.setState({
                        filterDropdownVisibleMap: filterDropdownVisibleMap,
                    }, () => this.searchInput && this.searchInput.focus());
                }
            }
            //需要时间范围查询
            else if (item.search && item.search === 'datetime') {

            }
            //需要数字范围查询
            else if (item.search && item.search === 'number') {

            }
        });
        /****************************以下获取能用于高级搜索的参数*********************************/
        let maxSearchTitle = 2;
        let searchLength = 0;
        let tyOptions = columns.map((item, index) => {
            if (item.commonSearch !== false && item.title != '序号' && item.title != '操作') {
                searchLength++;
                if (item.title.length > maxSearchTitle) {
                    maxSearchTitle = item.title.length;
                }
                return <Select.Option value={item.dataIndex} key={createUuid()}>{item.title}</Select.Option>
            } else {
                return '';
            }
        })
        const modalStyle = { width: '100%', left: 0, top: 0, paddingLeft: 267, boxSizing: 'border-box' }
        return (
            <div className={'nhTable'} style={{width:'100%',height:'100%'}}>
                {
                    this.props.searchDivFlag !== false ? <div className={styles.searchDiv} id='homeSearchDiv' style={{ marginBottom: '16px' }}>
                        <Select value={this.state.searchField}
                            onChange={this.zdySearchFieldChange}
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{ width: (tyOptions && searchLength > 6) ? (80 + (maxSearchTitle - 2) * 15) : 'auto' }}
                        >
                            <Select.Option value={this.state.tySearchAllField}>全部</Select.Option>
                            {
                                tyOptions
                            }
                        </Select>
                        <Search
                            placeholder="请输入查询条件"
                            onSearch={this.onSearch}
                            value={this.state.searchText}
                            onChange={this.zdySearchTextChange}
                            style={{ width: 230 }}
                        />
                        <Button type="primary" style={{ margin: '0 20px' }} onClick={this.onSearch}>查询</Button>
                        <Button type="Default" style={{ paddingLeft: 5 }} ghost icon="reload" onClick={this.onRest} >重置</Button>
                        {/*<Button type="Default" style={{paddingLeft:5}} ghost icon="search" onClick={this.highSeatch} >高级搜索</Button>*/}
                    </div> : ''

                }
                {
                    this.props.children ? <div style={{ marginBottom: '16px' }}>
                        {this.props.children}
                    </div> : ''
                }
                {
                    this.props.tip ? <div className={styles.tips_div} style={{ marginBottom: '16px' }}>
                        <Icon type="info-circle" />{this.props.tip}
                    </div> : ''
                }


                <Table
                    className={this.state.className}
                    size="small"
                    rowKey={this.props.rowKey}
                    rowSelection={rowSelection}
                    dataSource={this.state.data}
                    columns={columns}
                    pagination={Pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    defaultExpandAllRows={this.props.defaultExpandAllRows}
                    defaultExpandedRowKeys={this.props.defaultExpandedRowKeys}
                    expandedRowRender={this.props.expandedRowRender}
                    bordered={this.props.bordered}
                    showHeader={this.props.showHeader}
                    scroll={{ x: width, y: this.state.height }}
                    components={this.props.autoHeightFlag===true?undefined:this.components}
                    onRow={onRow}
                />
                <NHModal ref="nhExportExcelModal"
                    title="导出Excel"
                    width={570}
                    onOk={this.handleExportExcel}
                >
                    <ExpExcel ref="nhExpExcel" excelName={this.state.excelName} columns={this.props.columns} />
                </NHModal>
            </div>
        )
    }
}

export default NHTable;
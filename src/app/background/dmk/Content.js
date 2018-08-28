import React , {Component } from 'react';

import {    Button,  Modal, message , Switch } from 'antd';
import NHTable from '../../../components/NHTable';
import NHModal from '../../../components/NHModal';
import NHContainerFrame from '../../../components/NHContainerFrame';
import EditForm from './EditForm';
import AddContent from './AddContent';
import NHFetch from '../../../utils/NHFetch';
import getSize from '../../../utils/getSize';

export default class RightContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // searchParams: { flid: props.dataFlPkid },
            editData: {}, //修改的数据
            showOperationBtn: false,
            frameVisibleMap:{
                tableFlag:true,
                editFlag:false
            },
            zt0: '',
            zt1: '',
        }
    }
    //渲染前加载启用停用按钮参数
    componentDidMount() {
        NHFetch("/proData/selectDataList", "GET", { sign: 'dmk_xtgl_zt' })
            .then(resData => {
                if (resData.data != null) {
                    if (resData.data[0] != null && resData.data[1] != null && resData.data[0].VALUE == '1' && resData.data[1].VALUE == '0') {
                        this.setState({ zt0: resData.data[1].LABEL, zt1: resData.data[0].LABEL });
                    }
                }
            })
    }
    //选择左侧树节点的时候，刷新列表
    UNSAFE_componentWillReceiveProps(newProps) {
        // let flid = this.props.dataFlPkid;
        // let newFlid = newProps.dataFlPkid;
        // if (newFlid && newFlid != flid) {
        //     let searchParams = this.state.searchParams;
        //     searchParams['flid'] = newFlid;
        //     this.setState({ searchParams: searchParams }, function () {
        //         this.nhContentTable.filterTableData();
        //     });
        // }
    }

    //设置当前页面显示
    setCurrentPageShow = (showFlagName) => {
        let frameVisibleMap=this.state.frameVisibleMap;
        for(let name in frameVisibleMap){
            if(name==showFlagName){
                frameVisibleMap[name]=true;
            }else{
                frameVisibleMap[name]=false;
            }
        }
        this.setState({
            frameVisibleMap:frameVisibleMap
        });
    }
    handleCloseFrame = () => {
        this.setCurrentPageShow('tableFlag');
        this.nhContentTable.filterTableData();
    }

    //搜索
    onSearch = () => {
        this.setCurrentPageShow('tableFlag');
        this.nhContentTable.filterTableData();
        this.setState({
            showOperationBtn: false
        })
    }
    // //重置
    // onRest = () => {
    //     this.setState((prevState, props) => ({
    //         searchParams: { flid: this.props.dataFlPkid }
    //     }), function () {
    //         this.nhContentTable.onRest();
    //     });
    // }
    // //点击删除按钮
    handleDelete = () => {
        let rowKeys = this.nhContentTable.state.selectedRowKeys;
        if (rowKeys && rowKeys.length > 0) {
            this.deleteData(rowKeys);
        } else {
            message.warning('请选择需要删除的数据。');
        }
    }
    //删除数据
    deleteData = (pkids) => {
        Modal.confirm({
            content: "确定删除？",
            okType: 'danger',
            iconType: 'info-circle',
            onOk: () => {
                NHFetch("/dmk/cl/deleteMulti", 'post', pkids)
                    .then(res => {
                        if (res) {
                            message.success("删除成功！");
                            this.nhContentTable.filterTableData();
                        }
                    });
            }
        });
    }
    //删除操作
    operateDelete = (record) => {
        let pkid = record.pkid;
        this.deleteData([pkid]);
    }
    //修改状态
    operateChange = (record) => {
        let zt = record.zt;
        zt = zt == "1" ? "0" : "1";
        this.operateStatusFetch([record.pkid], zt);
    }
    handleChangePublish = (zt) => {
        let rowKeys = this.nhContentTable.state.selectedRowKeys;
        if (rowKeys && rowKeys.length > 0) {
            this.operateStatusFetch(rowKeys, zt);
        } else {
            Modal.warn({ content: '请选择数据' });
        }
    }
    operateStatusFetch = (rowKeys, zt) => {
        NHFetch(`/dmk/cl/${zt}/operateStatus`, 'post', rowKeys)
            .then(res => {
                if (res) {
                    this.nhContentTable.readTableData();
                    message.success("操作成功！");
                }
            });
    }
    // //修改数据
    // operateUpdate = (record) => {
    //     this.setState({ editData: record }, function () {
    //         this.updateContentModal.show();
    //         this.resetUpdateFormFields();
    //     });
    // }
    // //重置表单数据
    // resetUpdateFormFields = () => {
    //     let obj = this;
    //     if (this.contentUpdateForm) {
    //         obj.contentUpdateForm.resetFields();
    //     } else {
    //         setTimeout(function () {
    //             obj.resetUpdateFormFields();
    //         }, 100);
    //     }
    // }

    // //搜索框条件值改变时调用的方法
    // inputChange = (e) => {
    //     let searchParams = this.state.searchParams;
    //     let name = e.target.name;
    //     searchParams[name] = e.target.value;
    //     this.setState({
    //         searchParams: searchParams
    //     });
    // }
    // //高级搜索
    // highSeatch = () => {
    //     this.nhContentTable.highSeatch();
    //     //查询
    // }
    // handleSubmitContent = (stopLoading) => {
    //     this.contentUpdateForm.validateFields((err, values) => {

    //         if (err) {
    //             stopLoading();
    //             return;
    //         }

    //         NHFetch("/dataDictionaries/codebase/update", 'post', values)
    //             .then(res => {
    //                 if (res) {
    //                     this.updateContentModal.close();
    //                     this.nhContentTable.readTableData();
    //                     message.success("操作成功！");
    //                 }
    //                 stopLoading();
    //             });
    //     }).catch(err => stopLoading());
    // }

    // table选择后出现操作按钮
    rowSelectionChange = (selectedRowKeys) => {
        if (selectedRowKeys.length) {
            this.setState({
                showOperationBtn: true
            })
        } else {
            this.setState({
                showOperationBtn: false
            })
        }
    }

    handleAddContent = () => {
        this.setCurrentPageShow("editFlag");
    }

    handleSaveAdd = (stopLoading) => {
        this.refs.nhAddForm.saveAllFormData(stopLoading,() => {
            this.setCurrentPageShow("tableFlag");
            this.nhContentTable.filterTableData();
        });
    }

    render() {
        //表单数据操作
        let columns = [
            { title: '序号', dataIndex: 'rn', width: '50px' },
            {
                title: '代码',
                key: 'dm',
                width: '100px',
                dataIndex: 'dm'
            }, {
                title: '名称',
                key: 'mc',
                minWidth: '200px',
                dataIndex: 'mc'
            }, {
                title: '简称/别名',
                key: 'jc',
                width: '120px',
                dataIndex: 'jc'
            }
        ];
        if(this.props.fflid){
            columns.push({
                title: '父代码',
                key: 'fid',
                width: '100px',
                dataIndex: 'fid'
            });
        }
        columns.push({
            title: '排序号',
            key: 'pxh',
            width: '100px',
            dataIndex: 'pxh'
        });
        columns.push({
            title: "状态",
            key: 'zt',
            width: '100px',
            dataIndex: 'zt',
            render: (text, record, index) => {
                const status = record.zt == '1' ? true : false;
                return (
                   <Switch checkedChildren={'启动'} unCheckedChildren={'禁用'} checked={status} onChange={() => this.operateChange(record)} />
                );
            }
        });

        const action = [
            { title: '修改', onClick: this.operateUpdate},
            { title: '删除', onClick: this.operateDelete},

        ]
        const searchParams={
            s_dmbz_eq:this.props.dmbz?this.props.dmbz:'-1'
        }
        return (
            <div style={{ minHeight: 280, height: getSize().windowH - 123, overflow: 'hidden',margin:'12px 12px 0 12px',padding: '16px',background: '#fff' }}>
                <div style={{display:this.state.frameVisibleMap.tableFlag?'block':'none',height: getSize().windowH - 110}}>
                    <NHTable ref={(nhTable) => { this.nhContentTable = nhTable }}
                        rowKey={record => record.pkid}
                        sign={"yj_background_dmk_cl"}
                        columns={columns}
                        initParams={searchParams}
                        rowSelectionChange={this.rowSelectionChange}
                        action={action}
                    >
                        <Button type="primary" onClick={this.handleAddContent} disabled={this.props.dmbz?false:true}>维护代码常量</Button>
                        <Button type="danger" ghost style={{ marginLeft: 10 , display: this.state.showOperationBtn ? undefined : 'none' }}  onClick={this.handleDelete}>删除</Button>
                        <Button type="primary" ghost style={{ marginLeft: 10 , display: this.state.showOperationBtn ? undefined : 'none'}}  onClick={() => { this.handleChangePublish("1") }}>启用</Button>
                        <Button type="primary" ghost style={{ marginLeft: 10 , display: this.state.showOperationBtn ? undefined : 'none'}} onClick={() => { this.handleChangePublish("0") }}>禁用</Button>
                    </NHTable>
                </div>
                <NHContainerFrame ref="nhEditModal"
                            title="编辑代码信息"
                            visible={this.state.frameVisibleMap.editFlag}
                             onOk={this.handleSaveAdd}
                            onCancel={this.handleCloseFrame}
                    >
                    <AddContent ref="nhAddForm" dmbz={this.props.dmbz} fflid={this.props.fflid}/>
                </NHContainerFrame>
                <NHModal ref={(nhModal) => { this.updateContentModal = nhModal }} title={'修改代码库'} onOk={this.handleSubmitContent}>
                    <EditForm ref={(form) => { this.contentUpdateForm = form }} editData={this.state.editData} />
                </NHModal>
             </div>
        )

    }
}

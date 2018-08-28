import React from "react";
import { Button, message} from 'antd';
import getSize from "../../../utils/getSize";
import NHFetch from "../../../utils/NHFetch";
import NHTable from '../../../components/NHTable';
import {NHConfirm} from '../../../components/NHModal';
// import NHContainerFrame from '../../../components/NHContainerFrame';
// import EditForm from './EditForm.js';
// import ViewForm from './ViewForm.js';
import css from './index.css';

class TemplateTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formInitData: {},
            frameVisibleMap:{
                tableFlag:true,
                addFlag:false,
                updateFlag:false,
                showFlag:false,
            },
            showOperationBtn: false, //是否显示删除操纵按钮
        };
    }

    //设置当前页面显示
    setCurrentPageShow = (showFlagName) => {
        let frameVisibleMap=this.state.frameVisibleMap;
        for(let name in frameVisibleMap){
            if(name===showFlagName){
                frameVisibleMap[name]=true;
            }else{
                frameVisibleMap[name]=false;
            }
        }
        this.setState({
            frameVisibleMap:frameVisibleMap
        });
    }
    //面板关闭按钮点击事件
    handleCloseFrame = () => {
        this.setCurrentPageShow('tableFlag');
    }
    //选择行后显示删除操作按钮
    rowSelectionChange = (selectedRowKeys) => {
        this.setState({
            showOperationBtn: selectedRowKeys.length>0?true:false
        })
    }

    //导出Excel文件
    handleExportBtnClick = () => {
        this.refs.nhTable.exportExcel("导出基础数据");
    }
    //新增按钮点击事件
    handleAddBtnClick = () => {
        this.setCurrentPageShow('addFlag');
    }
    //修改按钮点击事件
    handleUpdateBtnClick = (record) => {
        let pkid = record.PKID;
        NHFetch('/demo/simpleTable/' + pkid + '/get', 'GET')
            .then(res => {
                if(res){
                    this.setState({formInitData: res.data});
                    this.setCurrentPageShow('updateFlag');
                }
            })
    }
    //查看按钮点击事件
    handleViewBtnClick = (record) => {
        let pkid = record.PKID;
        NHFetch('/demo/simpleTable/' + pkid + '/get', 'GET')
            .then(res => {
                if(res){
                    this.setState({formInitData: res.data});
                    this.setCurrentPageShow('showFlag');
                }
            })
    }

    //单行删除
    handleSingleDeleteBtnClick = (record) => {
       NHConfirm("是否确定删除这条数据？",() => {
           let pkid = record.PKID;
           this.handleDelete([pkid]);
       },"warn");
    }
    //多行删除
    handleMultiDeleteBtnClick = () => {
        let selectedRowKeys = this.refs.nhTable.state.selectedRowKeys;
        if(selectedRowKeys && selectedRowKeys.length>0){
            NHConfirm("是否确定删除选中的多条数据？",() => {
                this.handleDelete(selectedRowKeys);
            },"warn");
        }else{
            message.warning("请先选择需要删除的数据！");
        }
    }
    //删除操作
    handleDelete = (pkids) => {
        NHFetch('/demo/simpleTable/deleteByMulti' , 'POST' , pkids)
            .then(res => {
                if (res) {
                    message.success("删除操作成功！");
                    this.refs.nhTable.filterTableData();
                }
            })
    }
    //新增面板保存方法
    handleSaveAdd = (stopLoading) => {
        this.refs.nhAddForm.validateFields((err, formData) => {
            if (err) {
                return;
            }
            //处理级联下拉框的值
            formData.sfdm=formData.jlxlk[0];
            formData.csdm=formData.jlxlk[1];
            formData.qxdm=formData.jlxlk[2];
            //处理日期选择器的值，日期必须处理下，否则保存会报错
            formData.rq=new Date(formData.rq).valueOf();
            NHFetch('/demo/simpleTable/insert' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("新增基础数据信息成功！");
                        this.setCurrentPageShow('tableFlag');
                        this.refs.nhTable.filterTableData();
                    }
                })
                .catch(() => { stopLoading(); })
        });
    }
    //修改面板保存方法
    handleSaveUpdate = (stopLoading) => {
        this.refs.nhUpdateForm.validateFields((err, formData) => {
            if (err) {
                return;
            }
            formData.pkid = this.state.formInitData.pkid;
            //处理级联下拉框的值
            formData.sfdm=formData.jlxlk[0];
            formData.csdm=formData.jlxlk[1];
            formData.qxdm=formData.jlxlk[2];
            //处理日期选择器的值，日期必须处理下，否则保存会报错
            formData.rq=new Date(formData.rq).valueOf();
            NHFetch('/demo/simpleTable/update' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("修改基础数据信息成功！");
                        this.setCurrentPageShow('tableFlag');
                        this.refs.nhTable.filterTableData();
                    }
                })
                .catch(() => { stopLoading(); })
        });
    }

    render() {
        //列参数
        const columns = [
            {title: '序号',width: '60px',dataIndex: 'ROW_ID',fixed:'left'},
            {title: '商品代码',minWidth: '160px',dataIndex: 'spdm',fixed:'left'},
            {title: '商品名称',width: '90px',dataIndex: 'spmc',fixed:'left'},
            {title: '日期',width: '100px',dataIndex: 'RQ'},
            {title: '下拉框',minWidth: '120px',dataIndex: 'MZMMC'},
            {title: '省份',minWidth: '120px',dataIndex: 'SFMC'},
            {title: '城市',minWidth: '120px',dataIndex: 'CSMC'},
            {title: '区县',minWidth: '120px',dataIndex: 'QXMC'},
            {title: '文本框',minWidth: '300px',dataIndex: 'WBK'},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick},
            {title:'查看',onClick:this.handleViewBtnClick},
        ];
        return (
            <div className={css.main_right_content} style={{height:getSize().windowH-123}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.spid}
                             sign={"yj_erp_commondity"}
                             columns={columns}
                             action={action}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleAddBtnClick}>新增</Button>
                        {/* <Button type="primary" style={{marginRight:10}} onClick={this.handleExportBtnClick}>导出Excel</Button> */}
                        <Button type="danger" ghost style={{marginRight:10,display: this.state.showOperationBtn ? undefined : 'none'}} onClick={this.handleMultiDeleteBtnClick}>删除</Button>
                    </NHTable>
                </div>
                {/* <NHContainerFrame ref="nhAddModal"
                         title="新增基础数据信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhAddForm"/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhUpdateModal"
                         title="修改基础数据信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhUpdateForm" editData={this.state.formInitData}/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhShowModal"
                         visible={this.state.frameVisibleMap.showFlag}
                         title="查看基础数据信息"
                         onCancel={this.handleCloseFrame}
                >
                    <ViewForm editData={this.state.formInitData}/>
                </NHContainerFrame> */}
            </div>
        );
    }
}
export default TemplateTab;

import React from "react";
import {message,Button,Icon} from 'antd';
import NHContainerFrame from '../../../components/NHContainerFrame';
import NHTable from '../../../components/NHTable';
import NHConfirm from '../../../components/NHConfirm';
import getSize from '../../../utils/getSize';
import NHFetch from '../../../utils/NHFetch';
import EditForm from './EditForm.js';
import css from './index.css';


/**
 * 基础信息列表
 * @author yizhiqiang
 * @Email yizhiqiang@ly-sky.com
 * @date 2018-08-03 14:00
 * Version: 1.0
 */
class InlayTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formInitData: {},
            frameVisibleMap:{
                tableFlag:true,
                addFlag:false,
                updateFlag:false,
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
        let id = record.id;
        NHFetch('/menu/get', 'GET')
            .then(res => {
                if(res){
                    this.setState({formInitData: res.data});
                    this.setCurrentPageShow('updateFlag');
                }
            })
    }
    //查看按钮点击事件
    handleViewBtnClick = (record) => {
        let id = record.id;
        NHFetch('/menu/get', 'GET')
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
           let pkid = record.id;
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
              stopLoading();
                return;
            }
            NHFetch('/menu/add' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("新增菜单信息成功！");
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
              stopLoading();
              return;
            }
            formData.id = this.state.formInitData.id;
            NHFetch('/menu/update' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("修改菜单信息成功！");
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
            {title: '序号',width: '60px',dataIndex: 'rn',fixed:'left'},
            {title: '标题',minWidth: '160px',dataIndex: 'title',fixed:'left',sorted:false},
            {title: '访问地址',minWidth: '180px',dataIndex: 'url',sorted:false},
            {title: '图标',width: '100px',dataIndex: 'icon',render:(text,record) => {
              return <Icon type={record.icon} />
            },sorted:false},
            {title: '父节点',minWidth: '120px',dataIndex: 'parent_title',sorted:false},
            {title: '枝叶',minWidth: '60px',dataIndex: 'isDirectory',render:(text,record) => {
              if(record.isDirectory===0){
                return <font>枝</font>;
              }else{
                return <font>叶</font>;
              }
            },sorted:false},
            {title: '排序码',minWidth: '60px',dataIndex: 'sort',sorted:false},
            {title: '状态',minWidth: '60px',dataIndex: 'status',render:(text,record) => {
              if(record.status===1){
                return <font color={'green'}>启用</font>;
              }else{
                return <font color={'red'}>禁用</font>;
              }
            },sorted:false},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        return (
            <div className={css.main_right_content} style={{height:getSize().contentH-16}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_menu"}
                             columns={columns}
                             action={action}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                      <Button type="danger" ghost onClick={this.handleMultiDeleteBtnClick} style={{ marginRight: 10,display:this.state.showOperationBtn?undefined:'none' }} >删除</Button>
                    </NHTable>
                </div>
                <NHContainerFrame ref="nhAddModal"
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
            </div>
        );
    }
}
export default InlayTable;

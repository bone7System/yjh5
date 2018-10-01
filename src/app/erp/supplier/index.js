import React from "react";
import { Button, message} from 'antd';
import getSize from "../../../utils/getSize";
import NHFetch from "../../../utils/NHFetch";
import NHTable from '../../../components/NHTable';
import {NHConfirm} from '../../../components/NHModal';
import NHContainerFrame from '../../../components/NHContainerFrame';
import EditForm from './EditForm.js';
import ViewForm from './ViewForm.js';
import Contacts from './contacts/index.js';
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
                contactsFlag:false
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
        NHFetch('/supplier/getById', 'GET',{id:id})
            .then(res => {
                if(res){
                    this.setState({formInitData: res.data});
                    this.setCurrentPageShow('updateFlag');
                }
            })
    }
    //联系人信息维护
    handleContactsBtnClick = (record) => {
      let id = record.id;
      this.setState({id:id});
      this.setCurrentPageShow('contactsFlag');
    }

    //查看按钮点击事件
    handleViewBtnClick = (record) => {
        let id = record.id;
        // NHFetch('/commodity/getByPkid', 'GET',{pkid:spid})
        //     .then(res => {
        //         if(res){
        //             this.setState({formInitData: res.data});
        //             this.setCurrentPageShow('showFlag');
        //         }
        //     })
    }

    //单行删除
    handleSingleDeleteBtnClick = (record) => {
       NHConfirm("是否确定删除这条数据？",() => {
           let id = record.id;
           this.handleDelete([id]);
       },"warn");
    }

    //删除操作
    handleDelete = (ids) => {
        NHFetch('/supplier/delete' , 'POST' , ids)
            .then(res => {
                if (res) {
                    message.success("供应商删除成功！");
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
            if(formData.city && formData.city.length>=3){
              formData.city=formData.city[2];
            }
            NHFetch('/supplier/add' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("新增供应商信息成功！");
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
            if(formData.city && formData.city.length>=3){
              formData.city=formData.city[2];
            }
            formData.id=this.state.formInitData.id;
            NHFetch('/supplier/update' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("修改供应商信息成功！");
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
            {title: '供应商',width: '100px',dataIndex: 'name',fixed:'left'},
            {title: '注册编号',width: '90px',dataIndex: 'zcbh',fixed:'left'},
            {title: '公司性质',width: '90px',dataIndex: 'gsxz'},
            {title: '地址',minWidth: '200px',dataIndex: 'ssq',render: (text,record) => {
              return record.ssq+record.address;
            }}

        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'供应商联系人',onClick:this.handleContactsBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick},
            {title:'查看',onClick:this.handleViewBtnClick},
        ];
        return (
            <div className={css.main_right_content} style={{height:getSize().windowH-123}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.spid}
                             sign={"yj_erp_supplier"}
                             columns={columns}
                             action={action}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleAddBtnClick}>新增</Button>
                    </NHTable>
                </div>
                <NHContainerFrame ref="nhAddModal"
                         title="新增供应商信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                         onCancel={this.handleCloseFrame}
                         scrollHeight={getSize().windowH-190}
                >
                    <EditForm ref="nhAddForm"/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhUpdateModal"
                         title="修改供应商信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                         onCancel={this.handleCloseFrame}
                         scrollHeight={getSize().windowH-190}
                >
                    <EditForm ref="nhUpdateForm" editData={this.state.formInitData}/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhShowModal"
                         visible={this.state.frameVisibleMap.showFlag}
                         title="查看供应商信息"
                         onCancel={this.handleCloseFrame}
                         scrollHeight={getSize().contentH-16}
                >
                    <ViewForm editData={this.state.formInitData}/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhContactsModal"
                         visible={this.state.frameVisibleMap.contactsFlag}
                         title="供应商联系人编辑"
                         onCancel={this.handleCloseFrame}
                         scrollHeight={getSize().contentH-16}
                >
                    <Contacts editData={this.state.id}/>
                </NHContainerFrame>
            </div>
        );
    }
}
export default TemplateTab;

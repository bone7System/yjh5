import React from "react";
import {message,Button} from 'antd';
import NHContainerFrame from '../../../components/NHContainerFrame';
import NHModal from '../../../components/NHModal';
import NHTable from '../../../components/NHTable';
import NHConfirm from '../../../components/NHConfirm';
import getSize from '../../../utils/getSize';
import NHFetch from '../../../utils/NHFetch';
import EditForm from './EditForm.js';
import {getLoginUser} from '../../../utils/NHCore';
import css from './index.css';


class Permission extends React.Component {
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

    //选择行后显示删除操作按钮
    rowSelectionChange = (selectedRowKeys) => {
        this.setState({
            showOperationBtn: selectedRowKeys.length>0?true:false
        })
    }

    //新增按钮点击事件
    handleAddBtnClick = () => {
        this.refs.nhAddModal.show();
    }
    //修改按钮点击事件
    handleUpdateBtnClick = (record) => {
        let formInitData = {
          id:record.id,
          deptName:record.deptName
        }
        this.setState({formInitData: formInitData});
        this.refs.nhUpdateModal.show();
    }
    //查看按钮点击事件
    handleViewBtnClick = (record) => {
        let id = record.id;
        NHFetch('/depot/get', 'GET')
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
           this.handleDelete(pkid);
       },"warn");
    }

    //删除操作
    handleDelete = (pkid) => {
        NHFetch('/depot/delete' , 'POST' , {id:pkid})
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
            NHFetch('/depot/add' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("仓库新增成功！");
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
            formData.client = this.state.formInitData.client;
            NHFetch('/depot/update' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("仓库名称成功！");
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
            {title: '序号',width: '60px',dataIndex: 'rn'},
            {title: '仓库名称',minWidth: '160px',dataIndex: 'name',sorted:false}
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let user=getLoginUser();
        let params={
          client:user.client+''
        }
        return (
            <div className={css.main_right_content} style={{height:getSize().contentH-16}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_depot"}
                             columns={columns}
                             action={action}
                             initParams={params}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                    </NHTable>
                </div>
                <NHModal ref="nhAddModal"
                         title="新增仓库信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                >
                    <EditForm ref="nhAddForm" isAdd={true}/>
                </NHModal>
                <NHModal ref="nhUpdateModal"
                         title="修改仓库信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                >
                    <EditForm ref="nhUpdateForm" isAdd={false} editData={this.state.formInitData}/>
                </NHModal>
            </div>
        );
    }
}
export default Permission;

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

    //设置当前页面显示
    // setCurrentPageShow = (showFlagName) => {
    //     let frameVisibleMap=this.state.frameVisibleMap;
    //     for(let name in frameVisibleMap){
    //         if(name===showFlagName){
    //             frameVisibleMap[name]=true;
    //         }else{
    //             frameVisibleMap[name]=false;
    //         }
    //     }
    //     this.setState({
    //         frameVisibleMap:frameVisibleMap
    //     });
    // }
    //面板关闭按钮点击事件
    // handleCloseFrame = () => {
    //     this.setCurrentPageShow('tableFlag');
    // }
    //选择行后显示删除操作按钮
    rowSelectionChange = (selectedRowKeys) => {
        this.setState({
            showOperationBtn: selectedRowKeys.length>0?true:false
        })
    }

    //新增按钮点击事件
    handleAddBtnClick = () => {
        // this.setCurrentPageShow('addFlag');
        this.refs.nhAddModal.show();
    }
    //修改按钮点击事件
    handleUpdateBtnClick = (record) => {
        let formInitData = {
          id:record.id,
          deptName:record.deptName
        }
        this.setState({formInitData: formInitData});
        // this.setCurrentPageShow('updateFlag');
        this.refs.nhUpdateModal.show();
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
           this.handleDelete(pkid);
       },"warn");
    }

    //删除操作
    handleDelete = (pkid) => {
        NHFetch('/dept/delete' , 'POST' , {id:pkid})
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
            NHFetch('/dept/add' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("新增部门信息成功！");
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
            NHFetch('/dept/update' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("修改部门信息成功！");
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
            {title: '部门编号',width: '100px',dataIndex: 'client',sorted:false},
            {title: '部门名称',width: '160px',dataIndex: 'deptName',sorted:false},
            {title: '父级部门',minWidth: '240px',dataIndex: 'parentDeptName',sorted:false},
            {title: '创建时间',width: '120px',dataIndex: 'createTime',sorted:false},
            {title: '创建人',width: '120px',dataIndex: 'createName',sorted:false},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let user=getLoginUser();
        let params={
          path:user.clientPath
        }
        return (
            <div className={css.main_right_content} style={{height:getSize().contentH-16}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_dept"}
                             columns={columns}
                             action={action}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                    </NHTable>
                </div>
                <NHModal ref="nhAddModal"
                         title="新增部门信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhAddForm" isAdd={true}/>
                </NHModal>
                <NHModal ref="nhUpdateModal"
                         title="修改部门信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhUpdateForm" isAdd={false} editData={this.state.formInitData}/>
                </NHModal>
            </div>
        );
    }
}
export default Permission;

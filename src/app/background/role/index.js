import React from "react";
import {message,Button} from 'antd';
import NHContainerFrame from '../../../components/NHContainerFrame';
import NHTable from '../../../components/NHTable';
import NHConfirm from '../../../components/NHConfirm';
import getSize from '../../../utils/getSize';
import NHFetch from '../../../utils/NHFetch';
import EditForm from './editRole/EditForm.js';
import {getLoginUser} from '../../../utils/NHCore';
import css from './index.css';

class Role extends React.Component {
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
        this.refs.nhTable.readTableData();
    }
    //选择行后显示删除操作按钮
    rowSelectionChange = (selectedRowKeys) => {
        this.setState({
            showOperationBtn: selectedRowKeys.length>0?true:false
        })
    }

    //新增按钮点击事件
    handleAddBtnClick = () => {
        this.setCurrentPageShow('addFlag');
    }
    //修改按钮点击事件
    handleUpdateBtnClick = (record) => {
        let id = record.id;
        NHFetch('/role/getById?id='+id, 'GET')
        .then(res => {
          if(res){
            NHFetch('/role-permission/get?id='+id, 'GET')
            .then(res1 => {
                if(res1){
                  let permissions=[];
                  if(res1.data){
                    res1.data.map((item) => {
                      permissions.push(item.permissionId);
                      return;
                    });
                  }
                  let roleInfo=res.data;
                  if(roleInfo.parentId===-1){
                    roleInfo.parentId=undefined;
                  }
                  this.setState({
                    roleInfo: roleInfo,
                    permissions: permissions
                  });
                  this.setCurrentPageShow('updateFlag');
                }
            })
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
       NHConfirm("是否确定删除这个角色？",() => {
           let pkid = record.id;
           this.handleDelete(pkid);
       },"warn");
    }
    //删除操作
    handleDelete = (id) => {
        NHFetch('/role/role-delete' , 'POST' , {roleId:id})
            .then(res => {
                if (res) {
                    message.success("角色删除成功！");
                    this.refs.nhTable.filterTableData();
                }
            })
    }

    render() {
        //列参数
        const columns = [
          {title: '序号',width: '60px',dataIndex: 'rn'},
          {title: '角色',width: '120px',dataIndex: 'roleName',sorted:false},
          {title: '描述',minWidth: '180px',dataIndex: 'description',sorted:false},
          {title: '权限',minWidth: '240px',dataIndex: 'permission',sorted:false},
          {title: '创建时间',width: '140px',dataIndex: 'createTime',sorted:false},
          {title: '创建人',width: '100px',dataIndex: 'createName',sorted:false},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let sqlParams={client:getLoginUser().client+""}
        return (
            <div className={css.main_right_content} style={{height:getSize().contentH-16}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_role"}
                             columns={columns}
                             action={action}
                             sqlParams={sqlParams}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                    </NHTable>
                </div>
                <NHContainerFrame ref="nhAddModal"
                         title="新增角色信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={null}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhAddForm"  isUpdate={false}/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhUpdateModal"
                         title="修改角色信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={null}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhUpdateForm" isUpdate={true}
                      roleInfo={this.state.roleInfo} permissions={this.state.permissions}/>
                </NHContainerFrame>
            </div>
        );
    }
}
export default Role;

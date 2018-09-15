import React from "react";
import {message,Button} from 'antd';
import NHContainerFrame from '../../../components/NHContainerFrame';
import { RegularExpression } from "../../../components/NHFormItem/input-const";
import NHModal from '../../../components/NHModal';
import NHTable from '../../../components/NHTable';
import NHConfirm from '../../../components/NHConfirm';
import getSize from '../../../utils/getSize';
import NHFetch from '../../../utils/NHFetch';
import EditForm from './EditForm.js';
import EditPassWordForm from './editPassWord';
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
    //修改密码按钮点击事件
    handleUpdatePassBtnClick = (record) => {
      this.setState({
        client:record.client,
        userName:record.userName
      });
      this.refs.nhUpdatePassModal.show();
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
            if(formData.passWord!=formData.passWord2){
              message.error("两次密码不一致！");
              stopLoading();
              return;
            }
            let en_characters_pattern = new RegExp(RegularExpression.EN_NUMBER.rule.pattern);
            const password = formData.passWord;
            if (!en_characters_pattern.test(password)) {
              this.refs.nhAddForm.setFields({ password: { errors: [new Error('请输入6-16位数字或字母。')] } });
              stopLoading();
              return;
            }
            NHFetch('/user/add' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("新增用户信息成功！");
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
            NHFetch('/user/update' , 'POST' , formData)
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

    //修改面板保存的方法
    handleSaveUpdatePassWord = (stopLoading) => {
      this.refs.editPassWordForm.validateFields((err, formData) => {
        if (err) {
          stopLoading();
          return;
        }
        if(formData.passWord!=formData.passWord2){
          message.error("两次密码不一致！");
          stopLoading();
          return;
        }
        let en_characters_pattern = new RegExp(RegularExpression.EN_NUMBER.rule.pattern);
        const password = formData.passWord;
        if (!en_characters_pattern.test(password)) {
          this.refs.editPassWordForm.setFields({ password: { errors: [new Error('请输入6-16位数字或字母。')] } });
          stopLoading();
          return;
        }
        formData.client=this.state.client;
        formData.userName=this.state.userName;
        NHFetch('/user/update-password2' , 'POST' , formData)
            .then(res => {
                stopLoading();
                if (res) {
                    message.success("修改密码成功！");
                    this.refs.editPassWordForm.close();
                    this.refs.nhTable.readTableData();
                }
            })
            .catch(() => { stopLoading(); })
    });
    }

    render() {
        //列参数
        const columns = [
            {title: '序号',width: '60px',dataIndex: 'rn',fixed:'left'},
            {title: '用户名',width: '130px',dataIndex: 'userName',sorted:false,fixed:'left'},
            {title: '姓名',width: '120px',dataIndex: 'name',sorted:false,fixed:'left'},
            {title: '性别',width: '60px',dataIndex: 'sex',sorted:false,render: (index) => {
              if(index===1){
                return "男";
              }else if(index===2){
                return "女";
              }
              return;
            },fixed:'left'},
            {title: '所属门店',minWidth: '240px',dataIndex: 'deptName',sorted:false},
            {title: '用户角色',width: '120px',dataIndex: 'roleName',sorted:false},
            {title: '账号类型',width: '120px',dataIndex: 'typeMc',sorted:false},
            {title: '手机',width: '120px',dataIndex: 'phone',sorted:false},
            {title: '邮箱',width: '120px',dataIndex: 'email',sorted:false},
            {title: '身份证件号',width: '120px',dataIndex: 'certificate',sorted:false},
            {title: '兴趣爱好',width: '120px',dataIndex: 'interest',sorted:false}
        ];
        //行内操作
        const action = [
            {title:'编辑信息',onClick:this.handleUpdateBtnClick},
            {title:'修改密码',onClick:this.handleUpdatePassBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let user=getLoginUser();
        let params={
          client:user.client
        }
        return (
            <div className={css.main_right_content} style={{height:getSize().contentH-16}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_user"}
                             columns={columns}
                             action={action}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                    </NHTable>
                </div>
                <NHContainerFrame ref="nhAddModal"
                         title="新增用户信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhAddForm" isAdd={true}/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhUpdateModal"
                         title="修改用户信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhUpdateForm" isAdd={false} editData={this.state.formInitData}/>
                </NHContainerFrame>
                <NHModal ref="nhUpdatePassModal"
                         title="修改密码"
                         onOk={this.handleSaveUpdatePassWord}
                >
                    <EditPassWordForm ref="editPassWordForm"/>
                </NHModal>
            </div>
        );
    }
}
export default Permission;

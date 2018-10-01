import React from "react";
import {message,Button} from 'antd';
import NHModal from '../../../../components/NHModal';
import NHTable from '../../../../components/NHTable';
import NHConfirm from '../../../../components/NHConfirm';
import getSize from '../../../../utils/getSize';
import NHFetch from '../../../../utils/NHFetch';
import EditForm from './EditForm.js';
import {getLoginUser} from '../../../../utils/NHCore';
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
      let id = record.id;
      NHFetch('/supplier-linkman/getById', 'GET',{id:id})
          .then(res => {
              if(res){
                this.setState({formInitData: res.data});
                this.refs.nhUpdateModal.show();
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

    //删除操作
    handleDelete = (ids) => {
        NHFetch('/spplier-linkman/delete' , 'POST' , ids)
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
            formData.lfid=this.props.id;
            NHFetch('/spplier-linkman/add' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("新增联系人成功！");
                        this.refs.nhAddModal.close();
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
            formData.lfid = this.state.formInitData.lfid;
            NHFetch('/spplier-linkman/update' , 'POST' , formData)
                .then(res => {
                    stopLoading();
                    if (res) {
                        message.success("修改联系人成功！");
                        this.refs.nhUpdateModal.close();
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
            {title: '姓名',width: '100px',dataIndex: 'name',sorted:false},
            {title: '电话',width: '120px',dataIndex: 'phone',sorted:false},
            {title: '邮箱',width: '160px',dataIndex: 'email',sorted:false},
            {title: 'qq',width: '120px',dataIndex: 'qq',sorted:false},
            {title: '地址',minWidth: '240px',dataIndex: 'address',sorted:false},
            {title: '备注',minWidth: '160px',dataIndex: 'remark',sorted:false},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let params={
          lfid:this.props.id
        }
        return (
            <div className={css.main_right_content} style={{height:getSize().contentH-106}}>
                <div className={css.table} style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_supplier_linkman"}
                             columns={columns}
                             action={action}
                             initParams={params}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                    </NHTable>
                </div>
                <NHModal ref="nhAddModal"
                         title="新增联系人信息"
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                >
                    <EditForm ref="nhAddForm" />
                </NHModal>
                <NHModal ref="nhUpdateModal"
                         title="修改联系人信息"
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                >
                    <EditForm ref="nhUpdateForm" editData={this.state.formInitData}/>
                </NHModal>
            </div>
        );
    }
}
export default Permission;

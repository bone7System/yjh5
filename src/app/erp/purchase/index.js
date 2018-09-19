import React from "react";
import {message,Button} from 'antd';
import NHContainerFrame from '../../../components/NHContainerFrame';
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
        this.refs.nhTable.filterTableData();
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
        // this.refs.nhAddModal.show();
    }
    //修改按钮点击事件
    handleUpdateBtnClick = (record) => {
        let id=record.id;
        NHFetch("/purchase/search-byid","GET",{id:id})
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
    // //新增面板保存方法
    // handleSaveAdd = (stopLoading) => {
    //     this.refs.nhAddForm.validateFields((err, formData) => {
    //         if (err) {
    //           stopLoading();
    //           return;
    //         }
    //         NHFetch('/dept/add' , 'POST' , formData)
    //             .then(res => {
    //                 stopLoading();
    //                 if (res) {
    //                     message.success("新增部门信息成功！");
    //                     this.setCurrentPageShow('tableFlag');
    //                     this.refs.nhTable.filterTableData();
    //                 }
    //             })
    //             .catch(() => { stopLoading(); })
    //     });
    // }
    // //修改面板保存方法
    // handleSaveUpdate = (stopLoading) => {
    //     this.refs.nhUpdateForm.validateFields((err, formData) => {
    //         if (err) {
    //           stopLoading();
    //           return;
    //         }
    //         formData.id = this.state.formInitData.id;
    //         NHFetch('/dept/update' , 'POST' , formData)
    //             .then(res => {
    //                 stopLoading();
    //                 if (res) {
    //                     message.success("修改部门信息成功！");
    //                     this.setCurrentPageShow('tableFlag');
    //                     this.refs.nhTable.filterTableData();
    //                 }
    //             })
    //             .catch(() => { stopLoading(); })
    //     });
    // }

    render() {
        //列参数
        const columns = [
            {title: '序号',width: '60px',dataIndex: 'rn'},
            {title: '类型',width: '100px',dataIndex: 'type',sorted:false,render:(text) => {
              if(text===1){
                return '采购';
              }else if(text===2){
                return '退货';
              }
              return '';
            }},
            {title: '供应商',width: '160px',dataIndex: 'lifnr_name',sorted:false},
            {title: '供应商订单号',width: '120px',dataIndex: 'lifnrOrder',sorted:false},
            {title: '签单日期',width: '120px',dataIndex: 'qdrq',sorted:false},
            {title: '来源单据',width: '120px',dataIndex: 'ydlx',sorted:false},
            {title: '交货方式',width: '120px',dataIndex: 'jhfs_mc',sorted:false},
            {title: '运送方式',width: '120px',dataIndex: 'ysfs_mc',sorted:false},
            {title: '结算方式',width: '120px',dataIndex: 'jsfs_mc',sorted:false},
            {title: '支付方式',width: '120px',dataIndex: 'zffs_mc',sorted:false},
            {title: '总价格',width: '120px',dataIndex: 'kbetr',sorted:false},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let initParams={client:getLoginUser().client+""}
        return (
            <div style={{height:getSize().contentH,width:'100%'}}>
                <div className={css.main_right_content} style={{height:getSize().contentH-16,display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_purchase"}
                             columns={columns}
                             action={action}
                             initParams={initParams}
                             rowSelectionChange={this.rowSelectionChange}
                    >
                      <Button type="primary" ghost onClick={this.handleAddBtnClick} style={{ marginRight: 10 }} >新增</Button>
                    </NHTable>
                </div>
                {
                  this.state.frameVisibleMap.addFlag?<EditForm ref="nhAddForm" isAdd={true} handleCloseFrame={this.handleCloseFrame}/>:null
                }
                {
                  this.state.frameVisibleMap.updateFlag?<EditForm ref="nhUpdateForm" isAdd={false} formInitData={this.state.formInitData} handleCloseFrame={this.handleCloseFrame}/>:null
                }
            </div>
        );
    }
}
export default Permission;

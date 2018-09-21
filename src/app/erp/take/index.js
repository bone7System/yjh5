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
            {title: '点收日期',width: '120px',dataIndex: 'dsrq',sorted:false},
            {title: '到货日期',width: '120px',dataIndex: 'dhrq',sorted:false},
            {title: '签收人',width: '120px',dataIndex: 'qsr',sorted:false},
            {title: '收货地址',minWidth: '120px',dataIndex: 'shdz',sorted:false},
            {title: '备注',minWidth: '120px',dataIndex: 'remark',sorted:false},
            {title: '创建时间',width: '120px',dataIndex: 'createTime',sorted:false},
            {title: '创建人',width: '120px',dataIndex: 'createName',sorted:false},
        ];
        //行内操作
        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            // {title:'删除',onClick:this.handleSingleDeleteBtnClick}
        ];
        let initParams={client:getLoginUser().client+""}
        return (
            <div style={{height:getSize().contentH,width:'100%'}}>
                <div className={css.main_right_content} style={{height:getSize().contentH-16,display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <NHTable ref='nhTable'
                             rowKey={record =>record.id}
                             sign={"yj_erp_take"}
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

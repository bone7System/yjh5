import React from "react";
import {Button ,message} from 'antd';
import getSize from '../../../utils/getSize';
import NHFetch from '../../../utils/NHFetch';
import BasicForm from './BasicForm.js';
import DetailForm from './DetailForm';
import { createUuid } from "../../../utils/NHCore";


class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          detail:[],
          loading:false,
        }
    }

    handleDetailChange = (data,deleteIds) => {
      this.setState({
        detail:data,
        deleteIds:deleteIds
      });
    }

    handleSave = () => {
      if(this.props.isAdd){
        this.handleAddSave();
      }else{
        this.handleUpdateSave();
      }
    }

    handleAddSave = () => {
      this.setState({loading:true});
      this.refs.nhBasicForm.validateFields((err, formData) => {
          if (err) {
            this.setState({loading:false});
            return;
          }
          let detailList=this.state.detail?this.state.detail:[];
          let newDetailList=[];
          let seq=1;
          detailList.map((item,index) => {
            if(!item.isNew){
              item.rownum=seq;
              item.zwsj=item.zwsj?new Date(item.zwsj).valueOf():undefined;
              newDetailList.push(item);
            }
          });

          formData.qdrq=formData.qdrq?new Date(formData.qdrq).valueOf():undefined;
          let params={
            purchaseDtoC:formData,
            items:newDetailList
          };
          NHFetch('/purchase/add' , 'POST' , params)
              .then(res => {
                  this.setState({loading:false});
                  if (res) {
                      message.success("新增采集单成功！");
                      this.props.handleCloseFrame();
                  }
              })
              .catch(() => { this.setState({loading:false}); })
      });
    }

    handleUpdateSave = () => {
      this.setState({loading:true});
      this.refs.nhBasicForm.validateFields((err, formData) => {
          if (err) {
            this.setState({loading:false});
            return;
          }
          let detailList=this.state.detail?this.state.detail:[];
          let newDetailList=[];
          let seq=1;
          detailList.map((item,index) => {
            if(!item.isNew){
              item.rownum=seq;
              item.zwsj=item.zwsj?new Date(item.zwsj).valueOf():undefined;
              item.count1=0;
              item.count2=item.count;
              newDetailList.push(item);
            }
          });

          formData.qdrq=formData.qdrq?new Date(formData.qdrq).valueOf():undefined;
          formData.id=this.props.formInitData.head.id;
          formData.status=this.props.formInitData.head.status;
          let params={
            purchaseDtoC:formData,
            items:newDetailList,
            deleteIds:this.state.deleteIds?this.state.deleteIds:[]
          };
          NHFetch('/purchase/update' , 'POST' , params)
              .then(res => {
                  this.setState({loading:false});
                  if (res) {
                    console.info(res);
                      message.success("采集单修改成功！");
                      this.props.handleCloseFrame();
                  }
              })
              .catch(() => { this.setState({loading:false}); })
      });
    }


    render() {
        let formInitData=this.props.formInitData?this.props.formInitData:{};
        let head=formInitData.head?formInitData.head:{};
        let items=formInitData.items?formInitData.items.content:[];
        items.map((item) => {
          item.key=createUuid();
          return item;
        })
        return (
           <div style={{height:getSize().contentH,width:'100%'}}>
              <div style={{height:'60px',width:'100%',background:'white',marginTop:'-1px',lineHeight:'60px'}}>
                <span style={{fontSize:'20px',fontWeight:'bold',marginLeft:'20px'}}>采购单编辑</span>
              </div>
              <div style={{width:'100%',height:getSize().contentH-120,overflow:'auto'}}>
                <div style={{padding:'20px'}}>
                  <BasicForm ref="nhBasicForm" formInitData={head}/>
                  <DetailForm onChange={this.handleDetailChange} formInitData={items}/>
                </div>
              </div>
              <div  style={{height:'60px',width:'100%',background:'white'}}>
              <Button type="primary" onClick={this.props.handleCloseFrame} style={{float:'right',marginRight:'30px',marginTop:'15px'}}>返回</Button>
                <Button type="primary" loading={this.state.loading} onClick={this.handleSave} style={{float:'right',marginRight:'30px',marginTop:'15px'}}>提交</Button>
              </div>
           </div>
        );
    }
}
export default EditInitForm;

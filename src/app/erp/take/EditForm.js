import React from "react";
import {Button ,message,Col,Row} from 'antd';
import getSize from '../../../utils/getSize';
import NHFetch from '../../../utils/NHFetch';
import BasicForm from './BasicForm.js';
import DetailForm from './DetailForm';
import styles from './style.less';
import { createUuid } from "../../../utils/NHCore";
import NHSelect from "../../../components/NHSelect";


class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          detail:[],
          loading:false,
        }
    }

    handleDetailChange = (data) => {
      this.setState({
        detail:data
      });
    }

    handleSave = () => {
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
            if(item.cw && item.count){
              item.rownum=seq;
              newDetailList.push(item);
            }
          });
          let head=this.state.formInitData.head;
          formData.dsrq=formData.dsrq?new Date(formData.dsrq).valueOf():undefined;
          formData.dhrq=formData.dhrq?new Date(formData.dhrq).valueOf():undefined;
          formData.yddh=head.id;
          let params={
            head:formData,
            items:newDetailList
          };
          NHFetch('/take/add' , 'POST' , params)
              .then(res => {
                  this.setState({loading:false});
                  if (res) {
                      message.success("入库单成功！");
                      this.props.handleCloseFrame();
                  }
              })
              .catch(() => { this.setState({loading:false}); })
      });
    }

    handleSearch = () => {
      let purchaseId=this.state.purchaseId;
      if(!purchaseId){
        message.info("请选择采购单！");
        return;
      }
      NHFetch("/purchase/search-byid","GET",{id:purchaseId})
        .then(res => {
          if(res){
              this.setState({formInitData: res.data});
          }
      })
    }

    handleSelectChange = (value) => {
      this.setState({purchaseId:value});
    }


    render() {
        let formInitData=this.state.formInitData?this.state.formInitData:{};
        let head=formInitData.head?formInitData.head:{};
        let items=formInitData.items?formInitData.items.content:[];
        items.map((item) => {
          item.key=createUuid();
          return item;
        })
        return (
           <div style={{height:getSize().contentH,width:'100%'}}>
              <div className={styles.header} >
                <span style={{fontSize:'20px',fontWeight:'bold',marginLeft:'20px'}}>入库单编辑</span>
                <div className={styles.searchDiv}>
                  <Row>
                    <Col span={24}>
                      <font style={{float:'left'}}>采购单</font>
                      <NHSelect sign={'yj_erp_nocomplete_purchase'} value={this.state.purchaseId} onChange={this.handleSelectChange} style={{width:'200px',float:'left',marginLeft:'10px'}}/>
                      <Button type="primary" onClick={this.handleSearch} style={{float:'left',marginLeft:'10px'}}>搜索</Button>
                    </Col>
                  </Row>
                </div>
              </div>
              <div style={{width:'100%',height:getSize().contentH-180,overflow:'auto'}}>
                <div style={{padding:'20px'}}>
                  <BasicForm ref="nhBasicForm" formInitData={head}/>
                  <DetailForm onChange={this.handleDetailChange} items={items}/>
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

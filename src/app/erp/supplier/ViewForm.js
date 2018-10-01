import React from "react";
import {Form } from 'antd';
import NHFormItem from '../../../components/NHFormItem';

class ViewInitForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {

      const {form,editData} = this.props;

        return (
          <Form>
            <NHFormItem id={'spbm'} label={"商品编码"} form={form}>
              <span style={{fontSize:14,marginLeft:10}}>{editData.spbm}</span>
            </NHFormItem>
            <NHFormItem id={'spmc'} label={"商品名称"} form={form}  >
             <span style={{fontSize:14,marginLeft:10}}>{editData.spmc}</span>
            </NHFormItem>
            <NHFormItem id={'spms'} label={"商品描述"} form={form} >
              <span style={{fontSize:14,marginLeft:10}}>{editData.spms}</span>
            </NHFormItem>
            <NHFormItem id={'splxdm'} label={"商品类型"} form={form}  >
              <span style={{fontSize:14,marginLeft:10}}>{editData.splx}</span>
            </NHFormItem>
            <NHFormItem id={'sppp'} label={"商品品牌"} form={form}   >
              <span style={{fontSize:14,marginLeft:10}}>{editData.sppp}</span>
            </NHFormItem>
            <NHFormItem id={'gg'} label={"规格"} form={form}   >
              <span style={{fontSize:14,marginLeft:10}}>{editData.gg}</span>
            </NHFormItem>
            <NHFormItem id={'dj'} label={"等级"} form={form}   >
             <span style={{fontSize:14,marginLeft:10}}>{editData.dj}</span>
            </NHFormItem>
            <NHFormItem id={'dwdm'} label={"单位"} form={form}   >
              <span style={{fontSize:14,marginLeft:10}}>{editData.dw}</span>
            </NHFormItem>
            <NHFormItem id={'bzjg'} label={"标准价格"} form={form} >
              <span style={{fontSize:14,marginLeft:10}}>{editData.bzjg}</span>
            </NHFormItem>
        </Form>
        );
    }
}
const ViewForm = Form.create()(ViewInitForm);

export default ViewForm;

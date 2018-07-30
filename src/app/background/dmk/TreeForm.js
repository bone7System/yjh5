import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, message  } from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddTreeForm extends Component{
      constructor(props){
            super(props);
            this.state={
            }
      }
      
      render(){

            let {editData} = this.props;
            return (
                  <Form >
                        {
                             (editData && editData.dmbz)!==undefined?<NHFormItem label={"代码标志"} form={this.props.form}>{editData.dmbz}</NHFormItem>:
                                <NHFormItem id={"dmbz"} required={true} label={"代码标志"} pattern={{max:30,message:"长度不能超出30"}}
                                    form={this.props.form}  initialValue={editData?editData.dmbz:undefined}>
                                    <Input placeholder="代码标志" onChange={(e)=>{
                                          let value = e.target.value;
                                          e.target.value = value.toUpperCase();
                                    }}/>
                              </NHFormItem>
                        }
                        
                        <NHFormItem id={"dmmc"} required={true} label={"代码名称"} pattern={{max:100,message:"长度不能超出100"}}
                              form={this.props.form}  initialValue={editData?editData.dmmc:undefined}>
                              <Input placeholder="代码名称" />
                        </NHFormItem>
                        <NHFormItem id={"dmms"} label={"描述"} pattern={{max:100,message:"长度不能超出100"}}
                              form={this.props.form}  initialValue={editData?editData.dmms:undefined}>
                              <Input placeholder="描述" />
                        </NHFormItem>
                        <NHFormItem id={"fflid"} label={"父分类"}  form={this.props.form}  initialValue={editData?editData.fflid:undefined}>
                              <NHSelect sign={"yj_fldm"}/>
                        </NHFormItem>
                        <NHFormItem id={"pxh"} label={"排序号"} 
                              form={this.props.form}  initialValue={editData?editData.pxh:undefined}>
                              <InputNumber min={1} placeholder="排序号" />
                        </NHFormItem>
                        <NHFormItem id={"zt"} label="状态"  form={this.props.form} 
                              initialValue={editData?editData.zt:'1'}>
                              <RadioGroup>
                                    <Radio value={"1"}>启用</Radio>
                                    <Radio value={"0"}>禁用</Radio>
                              </RadioGroup>
                        </NHFormItem>
                  </Form>
            );
      }
}
const treeForm = Form.create()(AddTreeForm);
export default treeForm;
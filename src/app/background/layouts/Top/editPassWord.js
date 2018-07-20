import React, { Component} from 'react'
import { Form, Input} from 'antd';
import NHFormItem from "../../../../components/NHFormItem";

 class EditPassWordForm extends Component{
     constructor(props){
         super(props);
         this.state={

         }
     }



     render(){
         return (
             <Form>
                 <NHFormItem id={"oldPassWord"} label={"旧密码"} pattern={{min:6,max:16,message:"长度6-16位数字或字母"}}  form={this.props.form}  showFlag={true} required={true}>
                     <Input  placeholder={"请输入6-16位数字或字母"}  />
                 </NHFormItem>
                 <NHFormItem id={"newPassWord"} label={"新密码"} pattern={{min:6,max:16,message:"长度6-16位数字或字母"}} form={this.props.form} showFlag={true} required={true}>
                     <Input  placeholder={"请输入6-16位数字或字母"}/>
                 </NHFormItem>
                 <NHFormItem id={"confirmPassWord"} label={"确认密码"} pattern={{min:6,max:16,message:"长度6-16位数字或字母"}} form={this.props.form} showFlag={true} required={true}>
                     <Input  placeholder={"请输入6-16位数字或字母"}/>
                 </NHFormItem>
             </Form>
         );
     }
}
const editPassWordForm = Form.create({onValuesChange(props, values){props.onChange(values);}})(EditPassWordForm);
export default editPassWordForm;
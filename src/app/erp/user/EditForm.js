import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import NHMultiSelect from '../../../components/NHMultiSelect';
import {getLoginUser} from '../../../utils/NHCore';
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {

        const {form,editData} = this.props;
        let sqlParams={client:getLoginUser().client+""}
        return (
            <Form>
                <NHFormItem id={'userName'} label={"登录账号"} form={form} required={true} initialValue={editData?editData.userName:undefined} >
                    <Input placeholder={'建议输入手机号作为登录账号'} />
                </NHFormItem>
                <NHFormItem id={'deptId'} label={"所属部门"} form={form} required={true} initialValue={editData?editData.parentid:undefined}>
                    <NHSelect sign={'yj_dept'} />
                </NHFormItem>
                <NHFormItem id={'roleIds'} label={"用户角色"} form={form} required={true} initialValue={editData?editData.roleIds:undefined}>
                    <NHMultiSelect sign={'yj_erp_role'} sqlParams={sqlParams}/>
                </NHFormItem>
                {
                  this.props.isAdd?<NHFormItem id={'passWord'} label={"密码"} form={form} required={true} pattern={{min:6,max:16,message:"长度6-16位数字或字母"}} form={this.props.form}  >
                        <Input type={'password'} placeholder={"请输入6-16位数字或字母"}/>
                    </NHFormItem>:undefined
                }
                {
                  this.props.isAdd?<NHFormItem id={'passWord2'} label={"确认密码"} form={form} required={true} pattern={{min:6,max:16,message:"长度6-16位数字或字母"}} form={this.props.form} >
                        <Input type={'password'} placeholder={"请输入6-16位数字或字母"}/>
                    </NHFormItem>:undefined
                }
                {/* <NHFormItem id={'type'} label={"账号类型"} form={form} required={true} initialValue={editData?editData.type:undefined}>
                    <NHSelect sign={'dmk_ZHLX'} />
                </NHFormItem> */}
                <NHFormItem id={'phone'} label={"手机号码"} form={form} required={true} initialValue={editData?editData.phone:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'name'} label={"真实姓名"} form={form} required={true} initialValue={editData?editData.name:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'sex'} label={"性别"} form={form} required={true} initialValue={editData?editData.sex:1} >
                    <RadioGroup >
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                    </RadioGroup>
                </NHFormItem>
                <NHFormItem id={'email'} label={"邮箱"} form={form}  initialValue={editData?editData.email:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'certificate'} label={"身份证件号"} form={form}  initialValue={editData?editData.certificate:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'interest'} label={"兴趣爱好"} form={form}  initialValue={editData?editData.interest:undefined} >
                    <TextArea style={{height:"80px"}} />
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

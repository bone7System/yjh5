import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import NHMultiSelect from '../../../component/NHMultiSelect';
const { TextArea } = Input;
const RadioGroup = Radio.Group;




/**
 * 学校信息编辑表单
 * @author yizhiqiang
 * @Email yizhiqiang@ly-sky.com
 * @date 2018-03-02 14:00
 * Version: 1.0
 */
class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {

        const {form,editData} = this.props;

        return (
            <Form>
                <NHFormItem id={'userName'} label={"用户名"} form={form} required={true} initialValue={editData?editData.userName:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'deptId'} label={"所属部门"} form={form} initialValue={editData?editData.parentid:undefined}>
                    <NHSelect sign={'yj_dept'} />
                </NHFormItem>
                <NHFormItem id={'roleIds'} label={"用户角色"} form={form} initialValue={editData?editData.roleIds:undefined}>
                    <NHMultiSelect sign={'yj_dept'} />
                </NHFormItem>
                <NHFormItem id={'passWord'} label={"密码"} form={form} required={true} initialValue={editData?editData.passWord:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'passWord2'} label={"重复密码"} form={form} required={true} initialValue={editData?editData.passWord2:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'type'} label={"账号类型"} form={form} initialValue={editData?editData.type:undefined}>
                    <NHSelect sign={'yj_dept'} />
                </NHFormItem>
                <NHFormItem id={'phone'} label={"手机"} form={form} required={true} initialValue={editData?editData.phone:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'name'} label={"姓名"} form={form} required={true} initialValue={editData?editData.name:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'sex'} label={"性别"} form={form} required={true} initialValue={editData?editData.sex:'1'} >
                    <RadioGroup >
                        <Radio value={'1'}>男</Radio>
                        <Radio value={'2'}>女</Radio>
                    </RadioGroup>
                </NHFormItem>
                <NHFormItem id={'email'} label={"邮箱"} form={form} required={true} initialValue={editData?editData.email:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'certificate'} label={"身份证件号"} form={form} required={true} initialValue={editData?editData.certificate:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'interest'} label={"兴趣爱好"} form={form} required={true} initialValue={editData?editData.interest:undefined} >
                    <Input />
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

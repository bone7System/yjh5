import React from "react";
import {Form, Input } from 'antd';
import NHFormItem from '../../../../components/NHFormItem';
import { height } from "window-size";
const { TextArea } = Input;


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
                <NHFormItem id={'name'} label={"姓名"} form={form} required={true} initialValue={editData?editData.name:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'phone'} label={"电话"} form={form} required={false} initialValue={editData?editData.phone:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'email'} label={"邮箱"} form={form} required={false} initialValue={editData?editData.email:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'qq'} label={"QQ"} form={form} required={false} initialValue={editData?editData.qq:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'address'} label={"地址"} form={form} required={false} initialValue={editData?editData.address:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'remark'} label={"备注"} form={form} required={false} initialValue={editData?editData.remark:undefined} >
                    <TextArea style={{height:'80px'}} />
                </NHFormItem>

            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

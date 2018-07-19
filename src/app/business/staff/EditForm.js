import React from "react";
import {Form,  Input ,InputNumber } from 'antd';
import NHFormItem from '../../../components/NHFormItem';

class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {

        let {form,editData} = this.props;

        return (
            <Form>
                <NHFormItem id={'spmc'} label={"商品名称"} form={form} required={true} initialValue={editData?editData.JGSJ:undefined}>
                    <Input />
                </NHFormItem>
                <NHFormItem id={'spbh'} label={"商品编号"} form={form} required={true} initialValue={editData?editData.JGSJ:undefined}>
                    <Input />
                </NHFormItem>
                <NHFormItem id={'spjg'} label={"商品价格"} form={form} required={true} initialValue={editData?editData.JGSJ:undefined}>
                    <InputNumber />
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;
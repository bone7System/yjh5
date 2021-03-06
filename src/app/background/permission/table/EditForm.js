import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../../components/NHFormItem';
// import NHSelect from '../../../components/NHSelect';
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
                <NHFormItem id={'permission'} label={"权限值"} form={form} required={true} initialValue={editData?editData.permission:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'description'} label={"标题"} form={form} required={true} initialValue={editData?editData.description:undefined}>
                    <Input />
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

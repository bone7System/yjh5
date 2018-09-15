import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
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

        return (
            <Form>
                <NHFormItem id={'deptName'} label={"门店名称"} form={form} required={true} initialValue={editData?editData.deptname:undefined} >
                    <Input />
                </NHFormItem>
                {
                  this.props.isAdd?<NHFormItem id={'parentid'} label={"父级门店"} form={form} initialValue={editData?editData.parentid:undefined}>
                      <NHSelect sign={'yj_dept'} />
                  </NHFormItem>:undefined
                }
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

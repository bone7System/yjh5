import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
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
                <NHFormItem id={'client'} label={"部门编号"} form={form} required={true} initialValue={editData?editData.deptname:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'deptname'} label={"部门名称"} form={form} required={true} initialValue={editData?editData.deptname:undefined} >
                    <Input />
                </NHFormItem>
                 <NHFormItem id={'parentid'} label={"父级部门"} form={form} initialValue={editData?editData.parentid:undefined}>
                    <NHSelect sign={'yj_dept'} />
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

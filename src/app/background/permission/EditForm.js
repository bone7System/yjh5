import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
const { TextArea } = Input;




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
                <NHFormItem id={'menuId'} label={"所属菜单"} form={form} initialValue={editData?editData.menuId:undefined}>
                    <NHSelect sign={'yj_menu'}/>
                </NHFormItem>
                <NHFormItem id={'permission'} label={"权限值"} form={form} required={true} initialValue={editData?editData.permission:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'description'} label={"描述"} form={form} initialValue={editData?editData.description:undefined}>
                    <TextArea style={{height:'80px'}}/>
                </NHFormItem>
                <NHFormItem id={'parentId'} label={"父权限"} form={form} initialValue={editData?editData.parentId:undefined}>
                    <NHSelect sign={'yj_perssion'}/>
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;
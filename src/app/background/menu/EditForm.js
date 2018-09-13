import React from "react";
import {Form, Input , Radio  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';

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
                <NHFormItem id={'title'} label={"标题"} form={form} required={true} initialValue={editData?editData.title:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'url'} label={"访问地址"} form={form} required={true} initialValue={editData?editData.url:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'icon'} label={"图标"} form={form} initialValue={editData?editData.icon:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'isDirectory'} label={"枝叶"} form={form} required={true} initialValue={editData?editData.isDirectory:1}>
                    <RadioGroup >
                        <Radio value={1}>叶</Radio>
                        <Radio value={0}>枝</Radio>
                    </RadioGroup>
                </NHFormItem>
                <NHFormItem id={'parentId'} label={"父节点"} form={form} initialValue={editData?editData.parentId:undefined}>
                    <NHSelect sign={'yj_menu_directory'}/>
                </NHFormItem>
                <NHFormItem id={'sort'} label={"排序码"} form={form} required={true} initialValue={editData?editData.sort:1}>
                    <InputNumber min={1} max={100}/>
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

import React from "react";
import {Form, Input  , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
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
                <NHFormItem id={'spbm'} label={"商品编码"} form={form} required={true} initialValue={editData?editData.spbm:undefined} pattern={{max:20,message:"长度不能超出20"}}>
                    <Input />
                </NHFormItem>
                <NHFormItem id={'spmc'} label={"商品名称"} form={form} required={true} initialValue={editData?editData.spmc:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'spms'} label={"商品描述"} form={form} initialValue={editData?editData.spms:undefined} >
                   <TextArea style={{height:'80px'}}/>
                </NHFormItem>
                <NHFormItem id={'splxdm'} label={"商品类型"} form={form} required={true} initialValue={editData?editData.splxdm:undefined} >
                  <NHSelect sign={'dmk_splx'}/>
                </NHFormItem>
                <NHFormItem id={'sppp'} label={"商品品牌"} form={form} required={true} initialValue={editData?editData.sppp:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'gg'} label={"规格"} form={form} required={true} initialValue={editData?editData.gg:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'dj'} label={"等级"} form={form} required={true} initialValue={editData?editData.dj:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'dwdm'} label={"单位"} form={form} required={true} initialValue={editData?editData.dwdm:undefined} >
                  <NHSelect sign={'dmk_dw'}/>
                </NHFormItem>
                <NHFormItem id={'bzjg'} label={"标准价格"} form={form} required={true} initialValue={editData?editData.bzjg:undefined}>
                    <InputNumber min={1} max={100000}/>
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

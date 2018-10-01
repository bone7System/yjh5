import React from "react";
import {Form, Input  , Radio} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import NHCascader from '../../../components/NHCascader';
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
                <NHFormItem id={'type'} label={"类别"} form={form} required={true} initialValue={editData?editData.type:undefined}>
                  <NHSelect sign={'dmk_khlx'}/>
                </NHFormItem>
                <NHFormItem id={'name'} label={"客户名称"} form={form} required={true} initialValue={editData?editData.name:undefined} >
                  <Input />
                </NHFormItem>
                <NHFormItem id={'khfzr'} label={"客户负责人"} form={form} initialValue={editData?editData.khfzr:undefined} >
                 <Input />
                </NHFormItem>
                <NHFormItem id={'khphone'} label={"客户负责人电话"} form={form} required={false} initialValue={editData?editData.khphone:undefined} >
                  <Input />
                </NHFormItem>
                <NHFormItem id={'ywfzr'} label={"业务负责人"} form={form} initialValue={editData?editData.ywfzr:undefined} >
                 <Input />
                </NHFormItem>
                <NHFormItem id={'ywphone'} label={"业务负责人电话"} form={form} required={false} initialValue={editData?editData.ywphone:undefined} >
                  <Input />
                </NHFormItem>
                <NHFormItem id={'fhaddr'} label={"发货地址"} form={form}  initialValue={editData?editData.fhaddr:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'fhfs'} label={"发货方式"} form={form}  initialValue={editData?editData.fhfs:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'goodsman'} label={"接收人"} form={form} initialValue={editData?editData.goodsman:undefined} >
                 <Input />
                </NHFormItem>
                <NHFormItem id={'goodsphone'} label={"接收人电话"} form={form} required={false} initialValue={editData?editData.goodsphone:undefined} >
                  <Input />
                </NHFormItem>
                <NHFormItem id={'yb'} label={"邮编"} form={form}  initialValue={editData?editData.yb:undefined} >
                  <Input />
                </NHFormItem>
                <NHFormItem id={'address'} label={"详细地址"} form={form} required={false} initialValue={editData?editData.address:undefined}>
                   <Input />
                </NHFormItem>
                <NHFormItem id={'remark'} label={"备注"} form={form}  initialValue={editData?editData.remark:undefined} >
                  <TextArea style={{height:'80px'}}/>
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

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
        let city = undefined;
        if(editData && editData.city && editData.city.length===6){
          city = [];
          city.push(editData.city.substr(0,2));
          city.push(editData.city.substr(0,4));
          city.push(editData.city);
        }
        return (
            <Form>
                <NHFormItem id={'type'} label={"类别"} form={form} required={true} initialValue={editData?editData.type:undefined}>
                  <NHSelect sign={'dmk_gyslx'}/>
                </NHFormItem>
                <NHFormItem id={'name'} label={"供应商名称"} form={form} required={true} initialValue={editData?editData.name:undefined} >
                  <Input />
                </NHFormItem>
                <NHFormItem id={'zcbh'} label={"注册编号"} form={form} initialValue={editData?editData.zcbh:undefined} >
                 <Input />
                </NHFormItem>
                <NHFormItem id={'gsxz'} label={"公司性质"} form={form} required={false} initialValue={editData?editData.gsxz:undefined} >
                  <NHSelect sign={'dmk_gsxz'}/>
                </NHFormItem>
                <NHFormItem id={'jgdm'} label={"组织结构代码"} form={form}  initialValue={editData?editData.jgdm:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'dlfr'} label={"是否是独立法人"} form={form}  initialValue={editData?editData.dlfr:'1'} >
                  <RadioGroup >
                      <Radio value={'1'}>是</Radio>
                      <Radio value={'0'}>否</Radio>
                  </RadioGroup>
                </NHFormItem>
                <NHFormItem id={'yyzz'} label={"营业执照注册号"} form={form}  initialValue={editData?editData.yyzz:undefined} >
                    <Input />
                </NHFormItem>
                <NHFormItem id={'city'} label={"所在地省市区"} form={form} required={false} initialValue={city} >
                  <NHCascader sign={'yj_ssq'}/>
                </NHFormItem>
                <NHFormItem id={'address'} label={"详细地址"} form={form} required={false} initialValue={editData?editData.address:undefined}>
                 <Input />
                </NHFormItem>
                <NHFormItem id={'jlfw'} label={"经营范围"} form={form}  initialValue={editData?editData.jlfw:undefined} >
                  <TextArea style={{height:'80px'}}/>
                </NHFormItem>
                <NHFormItem id={'product'} label={"主要产品"} form={form}  initialValue={editData?editData.product:undefined} >
                  <TextArea style={{height:'80px'}}/>
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

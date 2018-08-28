import React from "react";
import {Form, Input , Radio , DatePicker , InputNumber} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import moment from 'moment';
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
                <NHFormItem id={'srk'} label={"输入框"} form={form} required={true} initialValue={editData?editData.srk:undefined} pattern={{max:10,message:"长度不能超出10"}}>
                    <Input />
                </NHFormItem>
                <NHFormItem id={'wbk'} label={"文本框"} form={form} required={true} initialValue={editData?editData.wbk:undefined}>
                    <TextArea style={{height:'80px'}}/>
                </NHFormItem>
                <NHFormItem id={'xlk'} label={"下拉框"} form={form} required={true} initialValue={editData?editData.xlk:undefined}>
                    <NHSelect sign={'zhxg_mzm'}/>
                </NHFormItem>

                <NHFormItem id={'dxk'} label={"单选框"} form={form} required={true} initialValue={editData?editData.dxk:'1'}>
                    <RadioGroup >
                        <Radio value={'1'}>启用</Radio>
                        <Radio value={'0'}>禁用</Radio>
                    </RadioGroup>
                </NHFormItem>
                <NHFormItem id={'rq'} label={"日期"} form={form} required={false} initialValue={(editData && editData.rq)?moment(editData.rq, 'yyyy-MM-dd'):undefined}>
                     <DatePicker format="YYYY-MM-DD" />
                </NHFormItem>
                <NHFormItem id={'sz'} label={"数字"} form={form} required={true} initialValue={editData?editData.sz:undefined}>
                    <InputNumber min={1} max={10}/>
                </NHFormItem>
            </Form>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

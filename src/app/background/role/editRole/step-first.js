import React, {Component} from "react";
import {Form, Switch, Input, InputNumber} from 'antd';
import NHFormItem from '../../../../components/NHFormItem';
import NHSelect from '../../../../components/NHSelect';
import {getLoginUser} from '../../../../utils/NHCore';
import PropTypes from 'prop-types';

const {TextArea} = Input;


class FirstStep extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {form, initFormData} = this.props;
        let sqlParams={
          client:getLoginUser().client+""
        }
        return (
            <div>
                <Form layout="horizontal">
                    <NHFormItem id={'roleName'} label={'角色名称'} form={form} required={true}
                                initialValue={initFormData?initFormData.roleName:undefined}>
                        <Input placeholder="请输入流程名称"/>
                    </NHFormItem>
                    <NHFormItem id={'description'} label={'描述'} form={form} required={true}
                                initialValue={initFormData?initFormData.description:undefined}>
                        <TextArea placeholder="请输入100字以内的说明" style={{height:'80px'}}/>
                    </NHFormItem>
                    {/* <NHFormItem id={'parenId'} label={"上级角色"} form={form} initialValue={initFormData?initFormData.parentId:undefined}>
                      <NHSelect sign={'yj_erp_role'} sqlParams={sqlParams}/>
                   </NHFormItem> */}
                </Form>
            </div>
        )
    }
}

FirstStep.defaultProps = {
    initFormData: {} //初始表单数据
}

FirstStep.propTypes = {
    initFormData: PropTypes.object //初始表单数据
}

// const firstStep = Form.create({onValuesChange(props, values){props.onChange(values);}})(FirstStep);
const firstStep = Form.create()(FirstStep);
export default firstStep;

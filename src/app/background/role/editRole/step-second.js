import React, { Component } from "react";
import { Form,Input} from 'antd';
import NHFormItem from '../../../../components/NHFormItem';
import NHMultiSelect from '../../../../components/NHMultiSelect';
import PropTypes from 'prop-types';


/**
 * 步骤二配置环节信息
 * Author: zengxiangkai@ly-sky.com
 * Created on: 2018-03-08 11:18:31
 * Version: 1.0
 * Modify log:
 */
class SeconedStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
       const {form, initFormData} = this.props;
        return (
            <div>
               <div>
                  <Form layout="horizontal">
                      <NHFormItem id={'permissions'} label={'权限'} form={form} required={true}
                                  initialValue={initFormData?initFormData.permissions:undefined}>
                          <NHMultiSelect sign="yj_perssion" placeholder="请选择权限"/>
                      </NHFormItem>
                  </Form>
              </div>
            </div>
        )
    }
}

SeconedStep.propTypes = {
    data: PropTypes.array, //缓存数据
}

// const seconedStep = Form.create({onValuesChange(props, values){props.onChange(values);}})(SeconedStep);
const seconedStep = Form.create()(SeconedStep);
export default seconedStep;

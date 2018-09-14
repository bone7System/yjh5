import React, { Component } from "react";
import { Form,Input} from 'antd';
import NHFormItem from '../../../../components/NHFormItem';
import NHMultiSelect from '../../../../components/NHMultiSelect';
import PropTypes from 'prop-types';


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
                                  initialValue={initFormData?initFormData:undefined}>
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

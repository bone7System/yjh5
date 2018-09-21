import React from "react";
import {Card , Form, Input , Radio  ,Row ,Col , InputNumber , DatePicker} from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import {getLoginUser} from '../../../utils/NHCore';
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

        const {form,formInitData} = this.props;
        const { getFieldDecorator } = form;
        let params={client:getLoginUser().client+""}
        return (
          <Card title="入库单基础信息" style={{marginBottom: '24px'}} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row>
                <Col lg={6} md={12} sm={24}>
                    <Form.Item label={'点收日期'}>
                      {getFieldDecorator('dsrq', {
                        rules: [{ required: true, message: '请选择点收日期' }],
                      })(
                        <DatePicker format="YYYY-MM-DD" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={'到货日期'}>
                      {getFieldDecorator('dhrq', {
                        rules: [{ required: true, message: '请选择到货日期' }],
                      })(
                        <DatePicker format="YYYY-MM-DD" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={'签收人'}>
                      {getFieldDecorator('qsr', {
                        rules: [{ required: true, message: '请输入签收人' }],
                      })(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                    <Form.Item label={'收货地址'}>
                      {getFieldDecorator('shdz', {
                        rules: [{ required: true, message: '请输入收货地址' }],
                      })(<Input placeholder="请输入收货地址" />)}
                    </Form.Item>
                  </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                    <Form.Item label={'备注'}>
                      {getFieldDecorator('shdz', {
                        rules: [{ required: false, message: '请输入备注' }],
                      })(<TextArea style={{height:'80px'}} />)}
                    </Form.Item>
                  </Col>
              </Row>
            </Form>
          </Card>
        );
    }
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

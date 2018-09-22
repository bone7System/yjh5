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
          <Card title="基础信息" style={{marginBottom: '24px'}} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={'类型'}>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择类型' }],
                      initialValue: formInitData.type?formInitData.type:1,
                    })(
                      <RadioGroup >
                          <Radio value={1}>采购</Radio>
                          <Radio value={2}>退货</Radio>
                      </RadioGroup>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={'供应商'}>
                    {getFieldDecorator('lifnr', {
                      rules: [{ required: true, message: '请选择供应商' }],
                      initialValue: formInitData.lifnr,
                    })(<NHSelect sign={'yj_erp_lfa'} params={params}/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={'供应商订单号'}>
                    {getFieldDecorator('lifnrOrder', {
                      rules: [{ required: true, message: '请输入供应商订单号' }],
                      initialValue: formInitData.lifnrOrder,
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={'签单日期'}>
                    {getFieldDecorator('qdrq', {
                      rules: [{ required: true, message: '请选择签单日期' }],
                      initialValue: formInitData.qdrq?moment(new Date(formInitData.qdrq),'YYYY-MM-DD'):undefined,
                    })(
                      <DatePicker format="YYYY-MM-DD" />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={'来源单据'}>
                    {getFieldDecorator('ydlx', {
                      rules: [{ required: false, message: '请输入来源单据' }],
                      initialValue: formInitData.ydlx,
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={'交货方式'}>
                    {getFieldDecorator('jhfs', {
                      rules: [{ required: false, message: '请选择交货方式' }],
                      initialValue: formInitData.jhfs,
                    })(<NHSelect sign={'DMK_JHFS'} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={'运送方式'}>
                    {getFieldDecorator('ysfs', {
                      rules: [{ required: false, message: '请选择运送方式' }],
                      initialValue: formInitData.ysfs,
                    })(
                      <NHSelect sign={'DMK_YSFS'} />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={'结算方式'}>
                    {getFieldDecorator('jsfs', {
                      rules: [{ required: false, message: '请选择结算方式' }],
                      initialValue: formInitData.jsfs,
                    })(<NHSelect sign={'DMK_JSFS'} />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={'支付方式'}>
                    {getFieldDecorator('zffs', {
                      rules: [{ required: false, message: '请选择支付方式' }],
                      initialValue: formInitData.zffs,
                    })(<NHSelect sign={'DMK_ZFFS'} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={'总价格(元)'}>
                    {getFieldDecorator('kbetr', {
                      rules: [{ required: true, message: '请输入总价格' }],
                      initialValue: formInitData.kbetr,
                    })(
                      <InputNumber min={0} max={1000000}/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 14, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={'备注'}>
                    {getFieldDecorator('remark', {
                      rules: [{ required: false, message: '请输入备注' }],
                      initialValue: formInitData.remark,
                    })(
                      <TextArea style={{height:'80px'}} />
                    )}
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

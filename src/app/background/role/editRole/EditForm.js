import React, {Component} from "react";
import {Form, Steps, Button, Row, Col, Divider} from 'antd';
import NHFetch from '../../../../utils/NHFetch';
import {getLoginUser} from '../../../../utils/NHCore';
import PropTypes from "prop-types";
import style from './index.css';
import FirstStep from './step-first';
import SeconedStep from './step-second';
import LastStep from './step-last';

const Step = Steps.Step;

class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0, //当前步骤
            roleInfo: {},
            isSuccess: false, //是否配置成功
            saveLoading:false
        }
    }

    //下一步
    next = () => {
        const current = this.state.current + 1;
        if (this.state.current == 0) {
            //校验、缓存第一步的角色信息
            this.saveRoleInfo(current);
        } else {
            this.setState({current});
        }
    }

    //上一步
    prev = () => {
        const current = this.state.current - 1;
        this.setState({current});
    }

    //校验、缓存第一步的流程配置数据
    saveRoleInfo = (current) => {
        this.firstStepForm.validateFields((err, roleInfo) => {
            if (err) {
                return;
            }
            this.setState({roleInfo:roleInfo,current:current});
        });
    }

    //完成
    handleFinish = () => {
        this.seconedStepForm.validateFields((err, permission) => {
          if (err) {
              return;
          }
          if(this.props.isUpdate){
            this.handleUpdate(this.state.roleInfo,permission);
          }else{
            this.handleSave(this.state.roleInfo,permission);
          }
      });
    }

    handleSave = (roleInfo,permission) => {
      roleInfo.client=getLoginUser().client;
      if(!roleInfo.parentId){
        roleInfo.parentId=-1;
      }
      this.setState({saveLoading:true});
      NHFetch( '/role/add', 'POST', roleInfo)
        .then(res => {
          if (res) {
              let params={
                roleId:res.data,
                permissions:permission.permissions
              }
              NHFetch( '/role-permission/save', 'POST',params)
                .then(res => {
                    if (res) {
                      this.setState({isSuccess: true,saveLoading:false});
                      this.next();
                    }
                });
            }
        });
    }

    handleUpdate = (roleInfo,permission) => {
      roleInfo.client=getLoginUser().client;
      if(!roleInfo.parentId){
        roleInfo.parentId=-1;
      }
      roleInfo.id=this.props.roleInfo.id;
      roleInfo.createTime=this.props.roleInfo.createTime;
      this.setState({saveLoading:true});
      NHFetch( '/role/update', 'POST', roleInfo)
        .then(res => {
          if (res) {
              let params={
                roleId:this.props.roleInfo.id,
                permissions:permission.permissions
              }
              NHFetch( '/role-permission/save', 'POST',params)
                .then(res => {
                    if (res) {
                      this.setState({isSuccess: true,saveLoading:false});
                      this.next();
                    }
                });
            }
        });
    }
        // if (this.state.isUpdate) {
        //     NHFetch( 'update', 'POST', formData)
        //         .then(res => {
        //             if (res) {
        //                 if (res.data == 1) {
        //                     this.setState({isSuccess: true});
        //                 }
        //                 this.next();
        //             }
        //         });
        // } else {
        //     NHFetch( 'insert', 'POST', formData)
        //         .then(res => {
        //             if (res) {
        //                 if (res.data == 1) {
        //                     this.setState({isSuccess: true});
        //                 }
        //                 this.next();
        //             }
        //         });
        // }

    //是否继续添加（重新配置）
    // handleReset = () => {
    //     this.setState({
    //         isUpdate: false, //是否是更新操作
    //         current: 0, //当前步骤
    //         lcxxData: {}, //配置的流程信息
    //         hjxxData: [], //配置的环节信息
    //         isSuccess: false, //是否配置成功
    //     });
    // }

    //步骤一内容
    getFirstContent() {
        return <FirstStep ref={(form) => this.firstStepForm = form}
          initFormData={this.props.roleInfo}/>;
    }

    //步骤二内容
    getSecondContent() {
        return <SeconedStep ref={(form) => this.seconedStepForm = form}
        initFormData={this.props.permissions} />
    }

    //最后一步内容
    getLastContent() {
        return <LastStep update={this.state.isUpdate} status={this.state.isSuccess}/>
    }

    render() {

        const {form, initFormData} = this.props;
        const {current} = this.state;

        const steps = [{
            title: '角色定义',
            content: this.getFirstContent(),
            // description: '说明：。'
        }, {
            title: '权限设置',
            content: this.getSecondContent(),
            // description: '说明：。'
        },{
            title: '完成',
            content: this.getLastContent(),
        }];

        return (
            <div style={{paddingTop:'20px'}}>
                <Row type="flex" justify="center">
                    <Col span={24}>
                        <Steps current={current}>
                            {steps.map(item => <Step key={item.title} title={item.title}/>)}
                        </Steps>
                        <div className={style["steps-content"]}>
                            {steps[this.state.current].content}
                        </div>
                        <div className={style["steps-action"]}>
                            {
                                this.state.current > 0 && this.state.current < steps.length - 1
                                &&
                                <Button style={{marginRight: 8}} onClick={this.prev}>
                                    上一步
                                </Button>
                            }
                            {
                                this.state.current < steps.length - 2
                                &&
                                <Button type="primary" style={{marginRight: 8}} onClick={this.next}>下一步</Button>
                            }
                            {
                                this.state.current === steps.length - 2
                                &&
                                <Button type="primary" onClick={this.handleFinish} loading={this.state.saveLoading}>完成</Button>
                            }
                        </div>
                        {
                            this.state.current < steps.length - 1 ? <Divider/> : null
                        }
                        <div className={style["steps-description"]}>
                            <p>{steps[this.state.current].description}</p>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

EditInitForm.propTypes = {
    initFormData: PropTypes.object, //初始数据
}

const EditForm = Form.create()(EditInitForm);

export default EditForm;

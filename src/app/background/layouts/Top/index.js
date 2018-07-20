import React from 'react'
import { Menu, Icon, Layout, Row, Col, Dropdown, Avatar, Tabs } from 'antd'
import touxiangman from './images/touxiangman-s.png';
import touxiangwoman from './images/touxiangwoman-s.png';
// import { userLogout } from "../../actions/login";
// import NHFetch from '../../../../utils/NHFetch';
import { getLoginUser } from '../../../../utils/NHCore';
import NHModal from "../../../../components/NHModal";
import EditPassWordForm from "./editPassWord";
const { Header } = Layout
const TabPane = Tabs.TabPane;

export default class Top extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            userSex: '1'
        }
    }

    componentDidMount() {
        let userLogin = getLoginUser();
        this.setState({ 
            userSex: userLogin.userSex?userLogin.userSex:'1',
            username: userLogin.userName 
        });
    }

    userLogout = () => {
        // userLogout(this.props.dispatch);
    }

    editPassWord = () => {
        // this.refs.nhEditPassWordModal.show();
    }

    savePassWord = () => {
    //     this.passWordForm.validateFields((err, values) => {
    //         if (err) {
    //             stopLoading();
    //             return;
    //         }
    //         let en_characters_pattern = new RegExp(RegularExpression.EN_NUMBER.rule.pattern);
    //         const oldPassWord = values['oldPassWord'];
    //         const newPassWord = values['newPassWord'];
    //         const confirmPassWord = values['confirmPassWord'];

    //         if (!en_characters_pattern.test(oldPassWord)) {
    //             this.passWordForm.setFields({ oldPassWord: { errors: [new Error('请输入6-16位数字或字母。')] } });
    //             stopLoading();
    //             return;
    //         }
    //         if (!en_characters_pattern.test(newPassWord)) {
    //             this.passWordForm.setFields({ newPassWord: { errors: [new Error('请输入6-16位数字或字母。')] } });
    //             stopLoading();
    //             return;
    //         }
    //         if (!en_characters_pattern.test(confirmPassWord)) {
    //             this.passWordForm.setFields({ confirmPassWord: { errors: [new Error('请输入6-16位数字或字母。')] } });
    //             stopLoading();
    //             return;
    //         }

    //         if (newPassWord !== confirmPassWord) {
    //             this.passWordForm.setFields({ confirmPassWord: { errors: [new Error('确认密码与新密码不一致，请确认。')] } });
    //             stopLoading();
    //             return;
    //         }
    //         let params =
    //             {
    //                 oldPassword: oldPassWord,
    //                 newPassword: newPassWord,
    //             }

    //         //修改密码
    //         NHFetch(`api/base/user/password/update`, 'post', params).then(res => {
    //             if (res && res.meta['success']) {
    //                 message.success("密码修改成功。");
    //                 this.passWordForm.resetFields();
    //                 this.refs.nhEditPassWordModal.close();
    //             } else {
    //                 console.log(res);
    //                 Modal.warn({
    //                     title: '密码修改反馈',
    //                     content: '异常：' + res.meta['message'],
    //                 });
    //             }
    //             stopLoading();
    //         })

    //     })
    }

   

    render() {
        const menu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.onMenuClick}>
                <Menu.Item key="editPassWord" ><a onClick={this.editPassWord}><Icon type="lock" />修改密码</a></Menu.Item>
                <Menu.Item key="logout" ><a onClick={this.userLogout}><Icon type="logout" />退出登录</a></Menu.Item>
            </Menu>
        );

        return (
            <Header style={{ background: '#fff', padding: 0 }}>
                <Row>
                    <Col span={12}>
                        {/* <Icon
                            className="trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                            style={{ fontSize: 20, marginLeft: 20, cursor: 'pointer' }}
                        /> */}
                    </Col>
                    <Col span={12} style={{ textAlign: 'right',paddingRight:'20px'}}>
                        <Dropdown overlay={menu}>
                            <span className='action account'>
                                <Avatar size="small" className='avatar' src={this.state.userSex == '1' ? touxiangman : touxiangwoman} />
                                <span className='name'>{this.state.username}</span>
                            </span>
                        </Dropdown>
                        <NHModal ref='nhEditPassWordModal' title="修改密码" onOk={this.savePassWord}>
                            <EditPassWordForm onChange={this.checkInfo}
                                ref={(form) => { this.passWordForm = form }}
                            />
                        </NHModal>
                    </Col>
                </Row>
            </Header>
        )
    }
}
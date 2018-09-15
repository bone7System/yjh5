import React from 'react'
import { Layout , Row ,Col ,Icon , Dropdown ,Avatar , Menu , Modal ,message} from 'antd';
import touxiangman from './images/touxiangman-s.png';
import touxiangwoman from './images/touxiangwoman-s.png';
// import { userLogout } from "../../../app/Login/background/";
import {  getLoginUser } from '../../../utils/NHCore';
import NHFetch from '../../../utils/NHFetch';
import NHModal from '../../../components/NHModal';
import { RegularExpression } from "../../../components/NHFormItem/input-const";
import EditPassWordForm from './editPassWord';
import styleCss from './index.css';
const { Header } = Layout

export default class Home extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
            username: '',
            userSex: '1',
            searchData: [],
        }
    }

    componentDidMount() {

    }


	/**
	 * 打开密码修改面板
	 */
	editPassWord = () => {
        this.refs.nhEditPassWordModal.show();
	}

	/**
	 * 修改密码保存事件
	 */
	savePassWord = (stopLoading) => {
        this.passWordForm.validateFields((err, values) => {
            if (err) {
                stopLoading();
                return;
            }
            let en_characters_pattern = new RegExp(RegularExpression.EN_NUMBER.rule.pattern);
            const newPassWord = values['newPassWord'];
            const confirmPassWord = values['confirmPassWord'];

            if (!en_characters_pattern.test(newPassWord)) {
                this.passWordForm.setFields({ newPassWord: { errors: [new Error('请输入6-16位数字或字母。')] } });
                stopLoading();
                return;
            }
            if (!en_characters_pattern.test(confirmPassWord)) {
                this.passWordForm.setFields({ confirmPassWord: { errors: [new Error('请输入6-16位数字或字母。')] } });
                stopLoading();
                return;
            }

            if (newPassWord !== confirmPassWord) {
                this.passWordForm.setFields({ confirmPassWord: { errors: [new Error('确认密码与新密码不一致，请确认。')] } });
                stopLoading();
                return;
            }
            let user=getLoginUser();
            let params =
                {
                  passWord: newPassWord,
                  passWord2: confirmPassWord,
                  userName:user.userName,
                  client:user.client
                }

            //修改密码
            NHFetch(`/user/update-password`, 'post', params).then(res => {
                if (res) {
                    message.success("密码修改成功。");
                    this.passWordForm.resetFields();
                    this.refs.nhEditPassWordModal.close();
                } else {
                    Modal.warn({
                        title: '密码修改反馈',
                        content: '异常：' + res.meta['message'],
                    });
                }
                stopLoading();
            })

        })
    }

	/**
	 * 退出登录
	 */
	userLogout = () => {
        // userLogout(this.props.dispatch);
  }

	render() {

		const menu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.onMenuClick}>
                {/* <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
                <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
                <Menu.Divider /> */}
               <Menu.Item key="editPassWord" ><a onClick={this.editPassWord}><Icon type="lock" />修改密码</a></Menu.Item>
                <Menu.Item key="logout" ><a onClick={this.userLogout}><Icon type="logout" />退出登录</a></Menu.Item>
            </Menu>
		);

		return(
			<Header style={{ background: '#fff', padding: 0 }}>
                <Row>
                    <Col span={12}>
                        <Icon
                            className="trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                            style={{ fontSize: 20, marginLeft: 20, cursor: 'pointer' }}
                        />
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        {/* <HeaderSearch
                            placeholder="请输入服务名称"
                            searchData={this.state.searchData}
                        /> */}

                        <Dropdown overlay={menu}>
                            <span className={styleCss.action}>
                                <Avatar size="small" className='avatar' src={(this.state.userSex === '1' || this.state.userSex === 1) ? touxiangman : touxiangwoman} />
                                <span className='name'>{this.state.username}</span>
                            </span>
                        </Dropdown>
                        <NHModal ref='nhEditPassWordModal' title="修改密码" onOk={this.savePassWord}>
                            <EditPassWordForm
                                ref={(form) => { this.passWordForm = form }}
                            />
                        </NHModal>
                    </Col>
                </Row>
            </Header>
		)
	}

}

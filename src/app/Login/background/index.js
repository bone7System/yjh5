import React from 'react'
import { Form, Icon, Input, Button, Checkbox  } from 'antd'
// import {userLogin} from './login.js';
import styles from './index.css'
const FormItem = Form.Item

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'tab1',
            active: {},
            count: 0,
            loading:false
        };
    }

    UNSAFE_componentWillMount () {
       
    }

    /**
     * 点击登录触发的方法
     */
    handleAccountSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['username','password'], { force: true },
            (err, values) => {
                if (!err) {
                    this.setState({
                        loading:true
                    });
                    // userLogin(values,()=> {
                    //     this.setState({
                    //         loading:false
                    //     });
                    // });
                }else{

                }
            }
        );
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <header style={{ marginBottom: 70, textAlign: 'center' }}>
                        
                    </header>
                    <div className={styles.main}>
                        <Form onSubmit={this.handleAccountSubmit}>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入您的账号！' }],
                                })(
                                    <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码！' }],
                                })(
                                    <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button className={styles.submit} type="primary" size="large" htmlType="submit" loading={this.state.loading}>
                                    登录
                                </Button>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox style={{ float: 'right' }}>记住登录</Checkbox>
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <div style={{margin:'48px 0 24px'}}> 
                    
                </div>
            </div>
        )
    }
}
const Login = Form.create()(LoginPage);
export default Login

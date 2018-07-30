import React from 'react';
import {  Layout } from 'antd';
import LeftTree from './LeftTree';
import RigntContent from './Content';
import getSize from '../../../utils/getSize';
const { Content , Sider } = Layout;


export default class Top extends React.Component{

    constructor(props){
        super(props);
        this.state={
            dmbz:undefined,
            fflid:undefined
        }
    }


    UNSAFE_componentWillMount(){
        

    }

    onTreeSelect = (dmbz,fflid) => {
        this.setState({
            dmbz:dmbz,
            fflid:fflid
        },() => {
            this.refs.rightContentRef.onSearch();
        });
    }

    render(){

       

        return (
            <Layout style={{ height: getSize().windowH-64 }}>
                <Sider width={300} style={{background:'white'}}>
                    <LeftTree
                        height={getSize().windowH-64}
                        onTreeSelect={this.onTreeSelect}
                    />
                </Sider>
                <Content style={{margin:'12px 12px 0 12px',padding:'16px',background: '#fff'}}>
                    <RigntContent dmbz={this.state.dmbz} fflid={this.state.fflid} ref={'rightContentRef'}/>
                </Content>
            </Layout>
        )
    }
}
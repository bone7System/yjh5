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
            <Layout style={{ height: getSize().windowH-110 }}>
                <Sider width={300} style={{background:'white'}}>
                    <LeftTree
                        height={getSize().windowH-110}
                        onTreeSelect={this.onTreeSelect}
                    />
                </Sider>
                <Content style={{ height: getSize().windowH-110,overflow:'hidden'}}>
                    <RigntContent dmbz={this.state.dmbz} fflid={this.state.fflid} ref={'rightContentRef'}/>
                </Content>
            </Layout>
        )
    }
}

import React from 'react';
import { Layout } from 'antd';
import getSize from '../../../utils/getSize';
import LeftTree from './tree/LeftTree';
import RigntContent from './table/index';
const { Content , Sider } = Layout;


export default class Document extends React.Component{

    constructor(props){
        super(props);
        this.state={
            menuId:'-1'
        }
    }


    UNSAFE_componentWillMount(){


    }

    onTreeSelect = (menuId) => {
        menuId = menuId?menuId:'-1';
        this.setState({
          menuId:menuId
        },() => {
            this.refs.rightContentRef.onSearch();
        });
    }

    render(){
        return (
            <Layout style={{ height: getSize().contentH}}>
                <Sider width={300} style={{background:'white'}}>
                    <LeftTree
                        height={getSize().contentH}
                        onTreeSelect={this.onTreeSelect}
                    />
                </Sider>
                <Content style={{ height: getSize().contentH,overflow:'hidden'}}>
                    <RigntContent menuId={this.state.menuId}  ref={'rightContentRef'}/>
                </Content>
            </Layout>
        )
    }
}

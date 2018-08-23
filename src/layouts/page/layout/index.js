import React from 'react'
import { Layout} from 'antd';
import Top from '../Top';
import Footer from '../Footer';
import getSize  from '../../../utils/getSize';
import MyContent from '../Content';
const { Content } = Layout;

export default class NHLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}


	render() {
		return(
			<div style={{width:'100%',height:'100%'}}>
				<Layout style={{ background:'#FFF6F6' }}>
          <Top />
          <div style={{height:getSize().windowH-65,overflow:'auto'}}>
            <Content style={{paddingTop:'20px'}}>
                {/* 页面显示区域 */}
                <MyContent height={getSize().windowH-185}>
                   {this.props.children}
                </MyContent>
            </Content>
            <Footer />
          </div>
        </Layout>
			</div>
		)
	}

}

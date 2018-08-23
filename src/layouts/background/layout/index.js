import React from 'react'
import { Layout} from 'antd';
import LeftMenu from '../LeftMenu';
import Top from '../Top';
import NavigationBar from '../NavigationBar';
import getSize  from '../../../utils/getSize';
import styleCss from './index.css';
import logo_collapsed from './images/logo-s.png';
const {  Sider, Content } = Layout;

export default class NHLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			collapsed: false,//是否关闭菜单
			fwmc:'统一开发者平台'
		};
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
    }

	render() {
		let curUrl=window.location.href.split('#')[1];

		return(
			<div style={{width:'100%',height:'100%'}}>
				<Layout style={{ height: '100%' }}>
					<Sider
						trigger={null}
						collapsible
						collapsed={this.state.collapsed}
						width={255}
					>
						<div className={styleCss.logo}>
							<img alt='' style={{maxWidth:40,maxHeight:40}} src={'api/zhxg-xtgl/schoolMng/downloadSchoolPictureByType?type=logo'} onError={(e)=>{
								e.target.src = logo_collapsed;
							}}/>
							{!this.state.collapsed && <span className={styleCss.logoSpan}><b>{this.state.fwmc}</b></span>}
						</div>
						<LeftMenu curUrl={curUrl}/>
					</Sider>
					<Layout>
						<Top collapsed={this.state.collapsed} toggle={this.toggle}/>
                <NavigationBar />
                <Content style={{height:getSize().windowH-110}}>
                  {this.props.children}
                </Content>
					</Layout>
				</Layout>
			</div>
		)
	}

}

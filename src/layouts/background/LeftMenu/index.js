import React from 'react'
import {  Icon, Menu } from 'antd';
import { Link} from 'dva/router';
import {getLoginUser} from '../../../utils/NHCore';
import getSize from '../../../utils/getSize';
import { Scrollbars } from 'react-custom-scrollbars';

/**图标 */
const userIconImg = require.context("./icons", true, /(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/);
const { SubMenu } = Menu;

export default class Home extends React.Component {
	constructor() {
        super()
        this.state = {
            expandedKeys: [],
            openKeys: [],
            selectedKeys: undefined,
            iconData:{}
        }
    }

	componentDidMount(){
        //图标
        let imgIconData = userIconImg.keys().map(userIconImg);
        let iconData = {};
        userIconImg.keys().map((imgName, key) => {
			iconData[imgName] = imgIconData[key];
			return imgName;
        });
        this.setState({iconData:iconData});
		this.loginSkip();
	}
	UNSAFE_componentWillReceiveProps(){
		this.loginSkip();
	}

	loginSkip = () => {
		let leftMenu=getLoginUser().menus?getLoginUser().menus:[];
		let curUrl=window.location.href.split('#')[1]+"/";
		for(let i = 0; i < leftMenu.length; i++) {
			if(leftMenu[i].children) {
				for(let j = 0; j < leftMenu[i].children.length; j++) {
					if( curUrl.startsWith(leftMenu[i].children[j].url+"/")) {
						this.setState({
							selectedKeys:leftMenu[i].children[j].key,
							openKeys:[leftMenu[i].key],
						});
					}
				}
			}else{
				if(curUrl.startsWith(leftMenu[i].url+"/")) {
					this.setState({
						selectedKeys:leftMenu[i].key,
						openKeys:[],
					});
				}
			}
		}
	}

	onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    }
    getAncestorKeys = (key) => {
        const map = { key };
        return map[key] || [];
	}

	onClick = (e) => {
		this.setState({
			selectedKeys:e.key
		});
	}


	render() {
		let leftMenu=getLoginUser().menus?getLoginUser().menus:[];
		return(
			<Scrollbars onScroll={this.onScroll}
                                    autoHide
                                    style={{ width: '100%'}}
                                    autoHeight
                                    autoHeightMin={0}
                                    autoHeightMax={getSize().windowH-64}
                                    thumbMinSize={30}
                                    universal={true}
            >
				<Menu theme="dark"
						mode="inline"
						openKeys={this.state.openKeys}
						onOpenChange={this.onOpenChange}
						selectedKeys={[this.state.selectedKeys]}
						onClick={this.onClick}
				>
					{leftMenu.map((item, index) => {
						if (item.children && item.children !== '' && item.children.length>0) {
							let htmlct = [];
							let menuItem = item.children.map((itemM, index) => {
								return <Menu.Item key={itemM.key}>
									<Link key={1} to={itemM.url} >
										{this.state.iconData[itemM.icon]?<img alt='' className='anticon'  src={this.state.iconData[itemM.icon]} style={{width:'14px',height:'14px',marginRight:'10px'}}/>:<Icon type={itemM.icon} />}
										<span>{itemM.name}</span>
									</Link></Menu.Item>
							})
							htmlct.push(<SubMenu key={item.key} title={<span>
								{this.state.iconData[item.icon]?<img alt='' className='anticon'  src={this.state.iconData[item.icon]} style={{width:'14px',height:'14px',marginRight:'10px'}}/>:<Icon type={item.icon} />}
								<span>{item.name}</span></span>}>{menuItem}</SubMenu>)
							return htmlct
						}else{
							return <Menu.Item key={item.key}>
								<Link key={1} to={item.url} >
									{this.state.iconData[item.icon]?<img alt='' className='anticon'  src={this.state.iconData[item.icon]} style={{width:'14px',height:'14px',marginRight:'10px'}}/>:<Icon type={item.icon} />}
									<span>{item.name}</span>
								</Link>
							</Menu.Item>
						}
					})}
				</Menu>
			</Scrollbars>
		)
	}

}

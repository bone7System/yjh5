import React from 'react'
import { Breadcrumb } from 'antd';
import {getLoginUser} from '../../../utils/NHCore';
import stylesCss from './index.css';

export default class Home extends React.Component {


	render() {
		let breadcrumbList=[];
        let leftMenu=getLoginUser().menus?getLoginUser().menus:[];
		let curUrl=window.location.href.split('#')[1]+"/";
		for(let i = 0; i < leftMenu.length; i++) {
			if(leftMenu[i].children) {
				for(let j = 0; j < leftMenu[i].children.length; j++) {
					if( curUrl.startsWith(leftMenu[i].children[j].url+"/")) {
						breadcrumbList.push(leftMenu[i],leftMenu[i].children[j]);
					}
				}
			}else{
				if(curUrl.startsWith(leftMenu[i].url+"/")) {
					breadcrumbList.push(leftMenu[i]);
				}
			}
		}
		return(
			<div className={stylesCss.breadcrumb}>
                <Breadcrumb style={{lineHeight:'44px',textIndent:'20px'}}>
                    {breadcrumbList.map(item => (
                        <Breadcrumb.Item key={item.key}>{item.name}</Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
		)
	}

}

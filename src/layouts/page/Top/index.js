import React from 'react';
//import { Button} from 'antd';
import createHashHistory from 'history/createHashHistory';
import styleCss from './index.css';
import {allMenus} from '../../../utils/menu.js';
import {getLoginUser , createUuid} from '../../../utils/NHCore';
import logo from './images/logo.png';
const hashHistory = createHashHistory();

export default class Top extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    rediretUrl = (url) =>{
        hashHistory.push({
            pathname: url,
        });
    }

    render(){
        let userType = getLoginUser().userType;
        let menus = allMenus[userType];
        let list = menus.map((item,index) => {
            let url = window.location.href.split('#')[1];
            let isBoolean = false;
            if(url && url.startsWith(item.url)){
                isBoolean = true;
            }
            return <li key={createUuid()} className={isBoolean?styleCss.c05:styleCss.c04} ><a onClick={() => { return this.rediretUrl(item.url)}}>{item.name}</a></li>;
        });

        return (
            <div className={styleCss.topCss}>
                <div className={styleCss.c01}>
                    <img src={logo} alt={''} className={styleCss.c02}/>

                    <ul className={styleCss.c03}>
                        {list}

                        {/* <li className={styleCss.c04}><a >首页</a></li>
                        <li className={styleCss.c04}><a >商品发货情况</a></li>
                        <li className={styleCss.c04}><a >我的商品</a></li>
                        <li className={styleCss.c04}><a >商品管理</a></li>
                        <li className={styleCss.c04}><a >员工管理</a></li> */}
                    </ul>
                </div>
            </div>
        )
    }
}

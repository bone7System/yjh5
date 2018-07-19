import React from "react";
import {Divider , Menu , Dropdown , Icon } from 'antd';
import {createUuid} from '../../utils/NHCore';

class Action extends React.Component {
    static defaultProps = {
        action:[],
        record:undefined
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let initAction=this.props.action;
        let record=this.props.record;

        let action=[];
        for(let i=0;i<initAction.length;i++){
            if(initAction[i].isShow===undefined || initAction[i].isShow(record)){
                action.push(initAction[i]);
            }
        }

        let actionHtml=[];
        if(action.length===1){
            actionHtml.push(<div key={createUuid()}><a  onClick={() => {if(action[0].onClick){action[0].onClick(record)}}}>{action[0].title}</a></div>)
        }else if(action.length===2){
            actionHtml.push(<div key={createUuid()}><a  onClick={() => {if(action[0].onClick){action[0].onClick(record)}}}>{action[0].title}</a><Divider type="vertical" /><a  onClick={() => {if(action[1].onClick){action[1].onClick(record)}}}>{action[1].title}</a></div>)
        }else if(action.length>0){
            let menuItems=[];
            for(let i=1;i<action.length;i++){
                menuItems.push(<Menu.Item key={i}><a   onClick={() => {if(action[i].onClick){action[i].onClick(record)}}}>{action[i].title}</a></Menu.Item>);
            }
            const menu = (
                <Menu >
                    {menuItems}
                </Menu>
            )
            const MoreBtn = () => (
                <Dropdown overlay={menu} >
                    <a>
                        更多 <Icon type="down"  />
                    </a>
                </Dropdown>

            )
            actionHtml.push(<div key={createUuid()}>
                <a    onClick={() => {if(action[0].onClick){action[0].onClick(record)}}}>{action[0].title}</a>
                <Divider type="vertical"  />
                <MoreBtn />
            </div>);
        }
        return (
            <div>{actionHtml}</div>
        );
    }
}

export default Action;
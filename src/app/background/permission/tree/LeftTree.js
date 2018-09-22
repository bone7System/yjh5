import React from 'react';
import NHTree from '../../../../components/NHTree';

export default class Top extends React.Component{

    constructor(props){
        super(props);
        this.state={
        }
    }


    UNSAFE_componentWillMount(){


    }

    onSelct = (selectKeys,selectNodes) => {
        const menuId=selectKeys.length>0?selectKeys[0]:undefined;
        this.props.onTreeSelect && this.props.onTreeSelect(menuId);
    }
    render(){
        return (
            <div>
                <NHTree
                    ref="nhNBTree"
                    sign='yj_background_menu'
                    checkable={false}
                    width={'300'}
                    height={this.props.height}
                    onSelect={this.onSelct}
                    showIcon={true}
                />
            </div>
        )
    }
}

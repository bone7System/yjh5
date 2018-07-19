import React from "react";
import {Transfer,Row, Col,Input,Button } from 'antd';

class ExpExcel extends React.Component {
    static defaultProps = {
        excelName:undefined,
        columns:[]
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            targetKeys:[],
            excelName:this.props.excelName,
            // btnDisabled:true,
        }
    }

    componentDidMount() {
        let dataSource=[];
        let targetKeys=[];
        this.props.columns.map((item,index) => {
            if(item.excel!==false){
                dataSource.push({
                    key:(item.excelKey?item.excelKey.toUpperCase():(item.dataIndex?item.dataIndex.toUpperCase():item.key.toUpperCase()))+"@"+item.title,
                    title:item.title
                });
                targetKeys.push((item.excelKey?item.excelKey.toUpperCase():(item.dataIndex?item.dataIndex.toUpperCase():item.key.toUpperCase()))+"@"+item.title);
            }
            return item;
        });
        this.setState({
            dataSource:dataSource,
            targetKeys:targetKeys
        });
    }

    handleChange = (targetKeys, direction, moveKeys) => {
        if(direction==='left'){
            this.setState({targetKeys:targetKeys});
        }else{
            let newTargetKeys=[];
            for(let i=moveKeys.length;i<targetKeys.length;i++){
                newTargetKeys.push(targetKeys[i]);
            }
            for(let i=0;i<moveKeys.length;i++){
                newTargetKeys.push(moveKeys[i]);
            }
            this.setState({targetKeys:newTargetKeys});
        }
    }

    handleSelectChange = (sourceSelectedKeys,targetSelectedKeys) => {
        this.setState({
            targetSelectedKeys:targetSelectedKeys
        });
        
        // if(targetSelectedKeys.length>0){
        //     this.setState({
        //         btnDisabled:false,
        //         targetSelectedKeys:targetSelectedKeys
        //     });
        // }else{
        //     this.setState({
        //         btnDisabled:true,
        //         targetSelectedKeys:targetSelectedKeys
        //     });
        // }
    }

    handleFileNameChange = (e) => {
        this.setState({
            excelName:e.target.value
        });
    }

     //上移排序
     handleUp = () => {
        const targetKeys = [...this.state.targetKeys];
        const targetSelectedKeys = [...this.state.targetSelectedKeys];
        //先将选中的key按原列表顺序排序（未排序前是选中的顺序，这样移动会有Bug）
        targetSelectedKeys.sort((a, b) => targetKeys.indexOf(a) - targetKeys.indexOf(b));
        for (let index in targetSelectedKeys) {
            let oldIndex = targetKeys.indexOf(targetSelectedKeys[index]);
            //如果不是第一个，则将下标减1
            if (oldIndex > -1 && oldIndex !== 0) {
                let newIndex = oldIndex - 1;
                let newKey = targetKeys[newIndex];
                let oldKey = targetKeys[oldIndex];
                //如果前面一个元素不是选中的元素，则进行替换
                if (targetSelectedKeys.indexOf(newKey) === -1) {
                    targetKeys[newIndex] = oldKey;
                    targetKeys[oldIndex] = newKey;
                }
            }
        }
        this.setState({ targetKeys: [...targetKeys] });
    }

    //下移排序
    handleDown = () => {
        const targetKeys = [...this.state.targetKeys];
        const targetSelectedKeys = [...this.state.targetSelectedKeys];
        //先将选中的key按原列表顺序排序（未排序前是选中的顺序，这样移动会有Bug, 下移时顺序反过来）
        targetSelectedKeys.sort((a, b) => targetKeys.indexOf(b) - targetKeys.indexOf(a));
        for (let index in targetSelectedKeys) {
            let oldIndex = targetKeys.indexOf(targetSelectedKeys[index]);
            //如果不是第最后一个，则将下标加1
            if (oldIndex > -1 && oldIndex !== (targetKeys.length - 1)) {
                let newIndex = oldIndex + 1;
                let newKey = targetKeys[newIndex];
                let oldKey = targetKeys[oldIndex];
                //如果后面一个元素不是选中的元素，则进行替换
                if (targetSelectedKeys.indexOf(newKey) === -1) {
                    targetKeys[newIndex] = oldKey;
                    targetKeys[oldIndex] = newKey;
                }
            }
        }
        //保存到form中
        this.setState({ targetKeys: [...targetKeys] });
    }

    //自定义底部排序按钮
    renderFooter = () => {
        return (
            <div>
                <Button
                    size="small"
                    style={{ float: 'right', margin: 5 }}
                    onClick={this.handleUp}
                    icon="up"
                />
                <Button
                    size="small"
                    style={{ float: 'right', margin: 5 }}
                    onClick={this.handleDown}
                    icon="down"
                />
            </div>
        );
    }

    render() {
        return ( 
            <div>
                <Row>
                    <Col>
                        <Transfer
                            rowKey={record => record.key}
                            dataSource={this.state.dataSource}
                            titles={['待选择列', '已选择列']} 
                            targetKeys={this.state.targetKeys}
                            onChange={this.handleChange}
                            onSelectChange={this.handleSelectChange}
                            render={item => item.title}
                            showSearch={true}
                            lazy={false}
                            listStyle={{
                                width: 235,
                                height: 300,
                            }}
                            footer={this.renderFooter}
                        />
                            
                      </Col>                      
                </Row>
                <Row span="2">
                    <Col style={{padding:"10px"}}>
                         文件名：<Input value={this.state.excelName} onChange={this.handleFileNameChange} style={{width:"450px"}}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ExpExcel;
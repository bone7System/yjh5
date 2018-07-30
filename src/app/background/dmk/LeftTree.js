import React from 'react';
import {  message  } from 'antd';
import NBTree from '../../../components/NBTree';
import {NHConfirm , NHModal} from '../../../components/NHModal';
import TreeForm from './TreeForm';
import NHFetch from '../../../utils/NHFetch';
import {baseUrl} from '../../../utils/NHPrefixUrl';

export default class Top extends React.Component{

    constructor(props){
        super(props);
        this.state={
            formInitData:{}
        }
    }


    UNSAFE_componentWillMount(){
        

    }

    onSelct = (selectKeys,selectNodes) => {
        const dmbz=selectKeys.length>0?selectKeys[0]:undefined;
        const fflid=selectNodes.length>0?selectNodes[0].fflid:undefined;
        this.props.onTreeSelect && this.props.onTreeSelect(dmbz,fflid);
    }
    
    handleAddBtn = () => {
        this.refs.nhAddModal.show();
    }

    handleUpdateClick = (item,key,e) => {
        let pkid=item.pkid;
        NHFetch(baseUrl + '/dmk/fl/getByPkid' , 'GET' , {pkid:pkid})
            .then(res => {
                if(res){
                    this.setState({formInitData: res.data});
                    this.refs.nhUpdateModal.show();
                }
            })
    }

    handleDeleteClick = (item,key,e) => {
        NHConfirm("是否确定删除该分类?",() => {
            NHFetch(baseUrl + '/dmk/fl/delete' , 'POST' , {pkid:item.pkid})
            .then(res => {
                if (res) {
                    message.success("分类信息删除成功！");
                    this.refs.nhNBTree.loadData();
                }
            })
        })
    }

     //新增面板保存方法
     handleSaveAdd = (stopLoading) => {
        this.refs.nhAddForm.validateFields((err, formData) => {
            if (err) {
                stopLoading();
                return;
            }
            NHFetch(baseUrl + '/dmk/fl/insert' , 'POST' , formData)
                .then(res => {
                    if (res) {
                        message.success("新增分类信息成功！");
                        this.refs.nhNBTree.loadData();
                        this.refs.nhAddModal.close();
                    }
                    stopLoading();
                }).catch(()=>{stopLoading()})
        });
    }
    //修改面板保存方法
    handleSaveUpdate = (stopLoading) => {
        this.refs.nhUpdateForm.validateFields((err, formData) => {
            if (err) {
                stopLoading();
                return;
            }
            formData.pkid = this.state.formInitData.pkid; 
            NHFetch(baseUrl + '/dmk/fl/update' , 'POST' , formData)
                .then(res => {
                    if (res) {
                        message.success("修改分类信息成功！");
                        this.refs.nhUpdateModal.close();
                        this.refs.nhNBTree.loadData();
                        stopLoading();
                    }
                }).catch( e => {stopLoading(); })
        });
    }

    /**
     * 判断按钮是否显示
     */
    handleIsShow = (item,key) => {
        if(key==='-1'){
            return false;
        }
        return true;
    }

    render(){

        const buttons=[
            {
                // type:'',
                name:'修改分类',
                onClick:this.handleUpdateClick,
                isShow:this.handleIsShow
            },
            {
                // type:'',
                name:'删除分类',
                onClick:this.handleDeleteClick,
                isShow:this.handleIsShow
            }
        ]
       
        return (
            <div>
                <NBTree
                    ref="nhNBTree"
                    sign='yj_background_dmk_fl'
                    checkable={false}
                    width={'300'}
                    height={this.props.height}
                    onSelect={this.onSelct}
                    showIcon={true}
                    addBtn={this.handleAddBtn}
                    buttons={buttons}
                />
                <NHModal ref="nhAddModal"
                        title="新增分类信息" 
                        onOk={this.handleSaveAdd}
                >
                    <TreeForm ref="nhAddForm"/>
                </NHModal>
                <NHModal ref="nhUpdateModal"
                            title="修改分类信息" 
                            onOk={this.handleSaveUpdate}
                >
                    <TreeForm ref="nhUpdateForm" editData={this.state.formInitData}/>
                </NHModal>
            </div>
        )
    }
}
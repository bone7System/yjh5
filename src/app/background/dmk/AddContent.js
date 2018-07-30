import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import NHFetch from '../../../utils/NHFetch';
import { Icon, Input, Button, InputNumber, message,Table,Tooltip,Col,Modal,Row  } from 'antd';
import {createUuid} from '../../../utils/NHCore';
import NHSelect from '../../../components/NHSelect';

export default class AddContent extends Component {
      constructor(props){
            super(props);
            this.state={
                  dataSource:[],
                  loading:true
            }
      }
      componentWillMount(){
            this.loadData();
      }
      componentWillReceiveProps(newProps){
            let resetFormFieldsFlag1 = this.props.resetFormFieldsFlag;
            let resetFormFieldsFlag = newProps.resetFormFieldsFlag;
            let submitFlag = newProps.submitFlag;
            if(resetFormFieldsFlag && !resetFormFieldsFlag1){
                  this.loadData();
            }
      }
      loadData = ()=>{
            let dmbz = this.props.dmbz;
            NHFetch("/dmk/cl/queryClList",'get',`dmbz=${dmbz}`)
                  .then(res => {
                        if (res && res.data) {
                              let rowNum = 1;
                              let data = res.data;
                              for(let map of data){
                                    if(map.pxh>=rowNum){
                                          rowNum = map.pxh+1;
                                    }
                                    map.id=createUuid();
                              }
                              this.setState({dataSource:data,rowNum:rowNum,loading:false});
                        }
                  });
      }
      //删除行
      deleteFormData = (record,index)=>{
            if(record.editable!==true){
                  Modal.confirm({
                        content:"确定删除？",
                        onOk:()=>{
                              NHFetch("/dmk/cl/deleteByDmbzAndDm",'post',{dmbz:record.dmbz,dm:record.dm})
                                    .then(res => {
                                          if (res && res.code == 200) {
                                                message.success("删除成功！");
                                                let dataSource = this.state.dataSource;
                                                dataSource.splice(index,1);
                                                this.setState({dataSource:dataSource});
                                          }
                                    });
                        }
                  });
            }else{//刚新增加的数据，还没有保存到数据库中
                  message.success("删除成功！");
                  let dataSource = this.state.dataSource;
                  dataSource.splice(index,1);
                  this.setState({dataSource:dataSource});
            }
           
      }
      //新增行
      addFormData = ()=>{
            let dataSource = this.state.dataSource;
            let rowNum = this.state.rowNum;
            dataSource.push({dmbz:this.props.dmbz,pxh:rowNum,zt:'1',editable:true,id:createUuid()});
            this.setState({dataSource:dataSource,rowNum:rowNum+1});
      }
      saveAllFormData = (stopLoading,closeFunc)=>{
            let dataSource = this.state.dataSource;
            dataSource = dataSource.filter(data=>data.editable);
            for(let saveData of dataSource){
                  let stateType = this.verifyData(saveData); 
                  if(!stateType){
                        stopLoading();
                        return false;
                  }
            }
            this.saveFetch(dataSource,stopLoading,closeFunc);
            return true;
      }
      //验证数据
      verifyData = (saveData)=>{
            let stateType = true;
            let errorMsg = '';
            if(!saveData.dm){
                  stateType = false;
                  errorMsg += '代码、';
            }
            if(!saveData.mc){
                  stateType = false;
                  errorMsg += '名称、';
            }
            if(!saveData.pxh){
                  stateType = false;
                  errorMsg += '排序号、';
            }
            if(!saveData.fid && this.props.fflid){
                  stateType = false;
                  errorMsg += '父代码、';
            }
            if(!stateType){
                  errorMsg = errorMsg.substr(0,errorMsg.length-1);
                  Modal.warn({content:errorMsg+"不能为空"});
            }
            return stateType;
      }
      //保存行
      saveFormData = (index)=>{
            let dataSource = this.state.dataSource;
            let saveData = dataSource[index];
            let stateType = this.verifyData(saveData);
            if(stateType){
                  this.saveFetch([saveData]);
                  dataSource[index].editable = false;
                  this.setState({dataSource:dataSource});
            }
      }
      saveFetch = (saveDatas,stopLoading,closeFunc)=>{
            NHFetch("/dmk/cl/insertClMulti",'post',saveDatas)
                  .then(res => {
                        if (res) {
                              message.success("操作成功！");
                        }
                        stopLoading && stopLoading();
                        closeFunc && closeFunc();
                  }).catch( () => {
                        stopLoading && stopLoading();
                  });
      }
      //编辑行
      eidtFormData = (index)=>{
            let dataSource = this.state.dataSource;
            dataSource[index].editable = true;
            this.setState({dataSource:dataSource});
      }
      changeInputData = (index,name,value,text)=>{
            let dataSource = this.state.dataSource;
            dataSource[index][name] = value;
            if(name=='fid'){
                  dataSource[index].fmc = text;
            }
            this.setState({dataSource:dataSource});
      }
      renderColumns = (text, record, index, key)=>{
            let value = record[key];
            return record.editable?(key=='pxh'?(<InputNumber min={1} value={value} onChange={(value)=>{this.changeInputData(index,key,value)}}/>)
            :(<Input value={value} style={{width:120}} onChange={(e)=>{this.changeInputData(index,key,e.target.value)}}/>))
            :record[key];
      }

      renderFidColumns = (text, record, index, key) => {
            return record.editable?<NHSelect style={{minWidth:'70px'}} url={'dmk/cl/getFdmListByFflid/'+this.props.fflid} value={record.fid?record.fid:undefined} onChange={(value,text)=>{this.changeInputData(index,key,value,text)}}/>:record.fmc;
      }

      render(){
            let formItemLayoutWithOutLabel = {
                  wrapperCol: {
                    xs: { span: 24, offset: 0 },
                    sm: { span: 20, offset: 4 },
                  },
            };
            let columns = [
                  { title: '序号', key: 'xh' ,width:'50px',render:(text, record, index)=>{return (<span>{index + 1}</span>);}},
                  { title: '代码', key: 'dm' ,dataIndex:'dm' ,render:(text, record, index)=>this.renderColumns(text, record, index, 'dm')},
                  { title: '名称', key: 'mc' ,dataIndex:'mc' , render:(text, record, index)=>this.renderColumns(text, record, index, 'mc')},
                  { title: '简称/别名', key: 'jc' ,dataIndex:'jc' ,render:(text, record, index)=>this.renderColumns(text, record, index, 'jc')}
            ];
            if(this.props.fflid){
                  columns.push({ title: '父代码', key: 'fid' ,dataIndex:'fid' ,render:(text, record, index)=>this.renderFidColumns(text, record, index, 'fid')}); 
            }
            columns.push({ title: '排序号', key: 'pxh' ,dataIndex:'pxh' ,render:(text, record, index)=>this.renderColumns(text, record, index, 'pxh')});
            columns.push({ title: '操作', key: 'cz' ,width:'80px',render:(text, record, index)=>{
                        return (<div>
                              {
                                    record.editable?<Tooltip  title="保存数据">
                                          <Icon type="save" style={{ fontSize: 16, cursor: 'pointer', color: '#03aaf4', marginRight: '10px' }} 
                                                onClick={() => this.saveFormData(index)} />
                                    </Tooltip>:<Tooltip  title="修改数据">
                                          <Icon type="edit" style={{ fontSize: 16, cursor: 'pointer', color: '#03aaf4', marginRight: '10px' }} 
                                                onClick={() => this.eidtFormData(index)} />
                                    </Tooltip>
                              }
                              <Tooltip  title="删除">
                                    <Icon type="delete" style={{ fontSize: 16, cursor: 'pointer', color: '#03aaf4',marginRight: '10px' }} 
                                          onClick={() => {this.deleteFormData(record,index)}} />
                              </Tooltip>
                        </div>);
                  }});

            return (<div>
                  <Table size="small" rowKey={record=>record.id} dataSource={this.state.dataSource} columns={columns} pagination={false}/>
                  <Row>
                        <Button loading={this.state.loading} type="dashed" icon='plus' style={{ width: '100%',backgroundColor:'#F0F9FF',marginTop:'10px' }}
                              onClick={this.addFormData}>{this.state.loading?'数据加载中...':'新增'}</Button>
                  </Row>
            </div>);
      }
}
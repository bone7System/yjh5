import React from 'react';
import {  Input ,Tooltip ,Button , Icon ,message } from 'antd';
import NHContainerFrame from '../../../components/NHContainerFrame';
import EditForm from './EditForm';
import ViewForm from './ViewForm';
import NHFetch from '../../../utils/NHFetch';
import NHTable from '../../../components/NHTable';
import {NHConfirm} from '../../../components/NHModal';
import styleCss from './index.css';

const Search = Input.Search;

export default class Top extends React.Component{

    constructor(props){
        super(props);
        this.state={
            frameVisibleMap:{
                tableFlag:true,
                addFlag:false,
                updateFlag:false,
            }
        }
    }


    UNSAFE_componentWillMount(){
        

    }

    //设置当前页面显示
    setCurrentPageShow = (showFlagName) => {
        let frameVisibleMap=this.state.frameVisibleMap;
        for(let name in frameVisibleMap){
            if(name===showFlagName){
                frameVisibleMap[name]=true;
            }else{
                frameVisibleMap[name]=false;
            }
        }
        this.setState({
            frameVisibleMap:frameVisibleMap
        });
    }

    //新增按钮点击事件
    handleAddBtnClick = () => {
        this.setCurrentPageShow('addFlag');
    }
    //修改按钮点击事件
    handleUpdateBtnClick = (record) => {
        // let pkid = record.PKID;//主键
        // NHFetch("url", 'GET')
        //     .then(res => {
        //         if(res){
        //             this.setState({formInitData: res.data});
        //             this.setCurrentPageShow('updateFlag');
        //         }
        //     })
    }
    //查看按钮点击事件
    handleUpdateBtnClick = (record) => {
        // let pkid = record.PKID;
        // NHFetch("url", 'GET')
        //     .then(res => {
        //         if(res){
        //             this.setState({formInitData: res.data});
        //             this.setCurrentPageShow('showFlag');
        //         }
        //     })
    }
    handleCloseFrame = () => {
        this.setCurrentPageShow('tableFlag');
    }

    //单行删除
    handleSingleDeleteBtnClick = (record) => {
       NHConfirm("是否确定删除这条数据？",() => {
           let pkid = record.PKID;
           this.handleDelete([pkid]);
       },"warn");
    }
    //多行删除
    handleMultiDeleteBtnClick = () => {
        let selectedRowKeys = this.refs.nhTable.state.selectedRowKeys;
        if(selectedRowKeys && selectedRowKeys.length>0){
            NHConfirm("是否确定删除选中的多条数据？",() => {
                this.handleDelete(selectedRowKeys);
            },"warn");
        }else{
            message.warning("请先选择需要删除的数据！");
        }
    }
    //删除操作
    handleDelete = (pkids) => {
        NHFetch("url" , 'POST' , pkids)
            .then(res => {
                if (res) {
                    message.success("删除操作成功！");
                    this.refs.nhTable.filterTableData();
                }
            })
    }
    //新增面板保存方法
    handleSaveAdd = (stopLoading) => {
        this.refs.nhAddForm.validateFields((err, formData) => {
            if (err) {
                stopLoading();
                return;
            }
           console.info(formData);
            // NHFetch("url" , 'POST' , formData)
            //     .then(res => {
            //         if (res) {
            //             message.success("新增学校信息成功！");
            //             this.setCurrentPageShow('tableFlag');
            //             this.refs.nhTable.filterTableData();
            //         }
            //         stopLoading()
            //     })
            //     .catch( () => {
            //         stopLoading()
            //     })
        });
    }
    //修改面板保存方法
    handleSaveUpdate = (stopLoading) => {
        this.refs.nhUpdateForm.validateFields((err, formData) => {
            if (err) {
                stopLoading();
                return;
            }
            // formData.pkid = this.state.formInitData.PKID; 

            // NHFetch('url' , 'POST' , formData)
            //     .then(res => {
            //         if (res) {
            //             message.success("修改学校信息成功！");
            //             this.setCurrentPageShow('tableFlag');
            //             this.refs.nhTable.filterTableData();
            //         }
            //         stopLoading()
            //     })
            //     .catch( () => {
            //         stopLoading()
            //     })
        });
    }

    render(){
        //加载模拟数据
        let data=[
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062931',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'},
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062932',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'},
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062933',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'},
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062934',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'},
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062935',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'},
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062936',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'},
            {spmc:'电脑桌懒人桌台式家用床上书桌简约小桌子简易折叠桌可移动床边桌',spbh:'2018062937',spjg:'200',kc:230,spsl:110,ycssps:120,zdzk:'90%',tjfs:'tjfs'}
        ];

        let columns = [
            {
                dataIndex:'spmc',
                title:'商品名称',
                minWidth:'140px',
                sorted:false,
                render:(value,row,index) => {
                    if(row.spmc.length>20){
                        return <Tooltip title={row.spmc}>{row.spmc.substring(0,20)}...</Tooltip>
                    }else{
                        return row.spmc;
                    }
                }
            },
            {
                dataIndex:'spbh',
                title:'商品编号',
                width:'110px',
                sorted:false
            },
            {
                dataIndex:'spjg',
                title:'商品价格',
                width:'90px',
                sorted:false
            },
            {
                dataIndex:'kc',
                title:'库存',
                width:'60px',
                sorted:false
            },
            {
                dataIndex:'spsl',
                title:'商品数量',
                width:'90px',
                sorted:false
            },
            {
                dataIndex:'ycssps',
                title:'已出售商品数',
                width:'120px',
                sorted:false
            },
            {
                dataIndex:'zdzk',
                title:'最低折扣',
                width:'90px',
                sorted:false
            },
            {
                dataIndex:'tjfs',
                title:'添加方式',
                width:'90px',
                sorted:false
            }
        ]

        const action = [
            {title:'修改',onClick:this.handleUpdateBtnClick},
            {title:'删除',onClick:this.handleSingleDeleteBtnClick},
            {title:'查看',onClick:this.handleViewBtnClick},
        ];

        return (
            <div className={styleCss.c01}>
                 <div  style={{display:this.state.frameVisibleMap.tableFlag?'block':'none'}}>
                    <div className={styleCss.c02}>
                        <Search
                            placeholder="请输入商品名称"
                            onSearch={value => console.log(value)}
                            style={{ width: 240,float:'right' }}
                        />
                    </div>
                    <div className={styleCss.c03}>
                        <Button type="dashed" className={styleCss.c04} onClick={this.handleAddBtnClick}><Icon type="plus" /></Button>
                    </div>
                    <NHTable
                        ref={'nhTable'}
                        rowKey={'spbh'}
                        mackData={data}
                        action={action}
                        columns={columns}
                        autoHeightFlag={true}
                        searchDivFlag={false}
                    />
                </div>
                <NHContainerFrame ref="nhAddModal"
                         title="新增商品信息" 
                         visible={this.state.frameVisibleMap.addFlag}
                         onOk={this.handleSaveAdd}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhAddForm"/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhUpdateModal"
                         title="修改商品信息" 
                         visible={this.state.frameVisibleMap.updateFlag}
                         onOk={this.handleSaveUpdate}
                         onCancel={this.handleCloseFrame}
                >
                    <EditForm ref="nhUpdateForm" initFormData={this.state.formInitData}/>
                </NHContainerFrame>
                <NHContainerFrame ref="nhShowModal"
                         visible={this.state.frameVisibleMap.showFlag}
                         title="查看商品信息" 
                         onCancel={this.handleCloseFrame}
                >
                    <ViewForm initFormData={this.state.formInitData}/>
                </NHContainerFrame>
            </div>
        )
    }
}
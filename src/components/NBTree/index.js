import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactDOM from 'react-dom';
import { Layout, Icon, Menu, Breadcrumb, Tree, Input, Popover, Tooltip } from 'antd';
import styles from './style.css'

import {createUuid} from '../../utils/NHCore';
import NHFetch from '../../utils/NHFetch';

import img1 from './images/01.png';
import img2 from './images/02.png';

const { Header, Sider, Content } = Layout;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;


/**
 * 树选择器
 * sql语句基础字段：key(value值),title:(显示的值)、selectFlag(是否可以选择，1：可以选择，0或null,不能选择)、parentKey(父Key)、icon（图标、1：文件夹，2：文件）
 *
 *
 *
 */
export default class NBTree extends React.Component {
    //设置可以传递参数的默认值
    static defaultProps = {
        sign:undefined,//标志
        showIcon:false,//是否显示树图标
        url:undefined, //查询数据的url,如果不给的话，则使用通用的查询数据的路径
        checkable:true,//默认开启多选框
        width:undefined,//树的宽度
        height:undefined,//树的高度
        onSelect:undefined,//选中数据的回调方法
        params:{},//查询条件
        sqlParams:{},//用于sql语句中的查询条件
        search: true,   //加搜索框
        buttons: [],   //鼠标右键点击事件回调type，name，onClick(item,key),isShow()
        addBtn: undefined,//加号触发事件方法（）=>{}
        expandedKeys: [],	//展开指定的树节点,如果设置了展开的节点，则使用此属性，如果没有设置则默认展开第一个节点
        disabled: false //是否禁用树
    };
    constructor(props) {
        super(props)
        this.state = {
            checkedKeys:[],//选中的值
            selectedKeys:[],//选中节点的数据
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            data: [],//树数据
            dataList: [],//树列表数据,主要在过滤的时候使用
            singerDataMap: {},//单选时可以选择的数据，主要在选中数据的时候获取key所对应的完整的值
            multiDataMap: {},//多选时可以选择的数据，主要在选中数据的时候获取key所对应的完整的值
        }
    }

    componentDidMount() {
        this.loadData();
    }

    UNSAFE_componentWillMount() {

    }

    componentWillUnmount() {

    }

    /**
     * 查询数据
     */
    loadData = () => {
        let obj=this;
        const url=this.props.url?this.props.url:'/proData/getTreeList';
        NHFetch(url,'POST',{params:this.props.params,sqlParams:this.props.sqlParams,sign:this.props.sign}).then( res => {
            if(res && res.data){
                let root=this.getDataRoot(res.data);
                let data=this.buildData(res.data,root);
                let dataList=obj.generateList(data);
                let singerDataMap=obj.getSingerDataMap(data);
                let multiDataMap=obj.getMultiDataMap(data);
                obj.setState({
                    data:data,
                    expandedKeys:this.props.expandedKeys.length>0?this.props.expandedKeys:[data[0].key],
                    dataList:dataList,
                    singerDataMap:singerDataMap,
                    multiDataMap:multiDataMap,
                });
            }
        });

    }

    /**
     * 获取数据最上一个节点的父节点
     */
    getDataRoot = (data) => {
        let keys={};
        let parentKeys=[];
        for(let i=0;i<data.length;i++){
            keys[data[i].key]=1;
            parentKeys.push(data[i].parentKey);
        }
        for(let i=0;i<parentKeys.length;i++){
            if(keys[parentKeys[i]]!==1){
                return parentKeys[i];
            }
        }
        return '-1';
    }

    /**
     * 装换数据的格式
     */
    buildData = (data,parentKey) => {
        if(!data || data.length<=0){
            return null;
        }
        let resultList=[];
        for(let i=0;i<data.length;i++){
            if(data[i].parentKey==parentKey){
                let childrenList=this.buildData(data,data[i].key);
                if(childrenList.length>0){
                    data[i].children=childrenList;
                }
                resultList.push(data[i]);
            }
        }
        return resultList;
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    //获取所有节点数据
    generateList = (data,parentKey) => {
        let dataList = [];
        if (data == [] || data == undefined || data.length == 0) {
            return [];
        }
        for (let i = 0; i < data.length; i++) {
            dataList.push({ key:data[i].key, title:  data[i].title,parentKey: parentKey});
            if (data[i].children && data[i].children.length>0) {
                dataList=dataList.concat(this.generateList(data[i].children, data[i].key));
            }
        }
        return dataList
    };

    //多选时只能选择最后一级的数据，且这个数据select属性不能是false(false表示不能选择)
    getMultiDataMap = (data) => {
        let map={};
        if(!data || data.length<=0){
            return {};
        }
        for (let i = 0; i < data.length; i++) {
            if(data[i].selectFlag!=='0' && data[i].selectFlag!==0 ){
                let value=this.copyMap(data[i]);
                map[data[i].key]=value;
           }else if(data[i].children && data[i].children.length>0){
                let childrenMap=this.getMultiDataMap(data[i].children);
                for(let key in childrenMap){
                    map[key]=childrenMap[key];
                }
           }
        }
        return map;
    }

    //单选时数据select属性不能是false(false表示不能选择)
    getSingerDataMap = (data) => {
        let map={};
        if(!data || data.length<=0){
            return {};
        }
        for (let i = 0; i < data.length; i++) {
           if(data[i].selectFlag!=='0' && data[i].selectFlag!==0 ){
                let value=this.copyMap(data[i]);
                map[data[i].key]=value;
           }
           if(data[i].children && data[i].children.length>0){
                let childrenMap=this.getSingerDataMap(data[i].children);
                for(let key in childrenMap){
                    map[key]=childrenMap[key];
                }
           }
        }
        return map;
    }

    copyMap = (map) => {
        let resultMap={};
        for(let key in map){
            if(key!='children'){
                resultMap[key]=map[key];
            }
        }
        return resultMap;
    }
    //搜索输入变化事件
    onChange = (e) => {
        let value = e.target.value;
        if(value){
            value=value.trim();
        }
        let expandedKeys = this.state.dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return item.parentKey?item.parentKey:null;
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        if (value == '' || !expandedKeys) {
            if(this.state.data && this.state.data.length>0){
                expandedKeys = [this.state.data[0].key];
            }else{
                expandedKeys = []
            }
        }
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }


    //字段限制返回
    modifyTextLength = (str, len) => {
        if (str.length * 2 <= len || len == undefined) {
            return str;
        }
        var strlen = 0;
        var val = "";
        for (var i = 0; i < str.length; i++) {
            val = val + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return val.substring(0, val.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return val.substring(0, val.length - 2) + "...";
                }
            }
        }
        return val;
    }

    //树字段限制
    getTextLength = (val) => {
        let width=parseInt(this.props.width)-(this.props.checkable?55:35);
        let count=width/15;
        count=count+1-val;
        //如果需要显示图标，则能够显示的字减少一个
        if(this.props.showIcon){
            count=count-1;
        }
        return parseInt(count)*2;
    }

    //单选，选中了数据
    onSelect = (checkedKeys) => {
        if(this.props.checkable!=true){
            let selectKeys=[];
            let selectNodes=[];
            for(let seq in checkedKeys){
                let checkedKey=checkedKeys[seq];
                if(this.state.singerDataMap[checkedKey]){
                    selectKeys.push(checkedKey);
                    selectNodes.push(this.state.singerDataMap[checkedKey]);
                }
            }
            if(this.props.onSelect){
                this.props.onSelect(selectKeys,selectNodes);
            }
        }
        this.setState({
            selectedKeys:checkedKeys
        });
    }
    //多选，选中了选择框
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys:checkedKeys});
        if(this.props.checkable==true){
            let selectKeys=[];
            let selectNodes=[];
            for(let seq in checkedKeys){
                let checkedKey=checkedKeys[seq];
                if(this.state.multiDataMap[checkedKey]){
                    selectKeys.push(checkedKey);
                    selectNodes.push(this.state.multiDataMap[checkedKey]);
                }
            }
            if(this.props.onSelect){
                this.props.onSelect(selectKeys,selectNodes);
            }
        }
    }

    handleTreeIcon = (props) => {
        let icon = props.dataRef.icon;
        if(icon==1){
            return <img style={{marginBottom:'4px'}} src={img1}/>
        }else if(icon==2){
            return <img style={{marginBottom:'4px'}} src={img2}/>
        }
        return <img style={{marginBottom:'4px'}} src={img1}/>;
    }

    //渲染tree
    loop = (data,level) => {
        return data.map((item) => {
            const { searchValue } = this.state;
            let val = this.modifyTextLength(item.title, this.getTextLength(level));
            const index = val.indexOf(searchValue);
            const beforeStr = val.substr(0, index);
            const afterStr = val.substr(index + searchValue.length);
            const titleContent = (
                <div style={{padding:'5px'}}>
                    {item.title}
                </div>
            );
            let title = index > -1 ? (
                <span>
					{beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
				</span>

            ) : <span>{val}</span>;
            if (val.indexOf('...') > -1) {
                title = (
                    <Popover placement="right" content={titleContent} trigger="hover" >
                        {title}
                    </Popover>
                )
            }
            if (item.children) {
                return (
                    <TreeNode key={item.key} icon={this.handleTreeIcon} title={title} dataRef={item} disabled={this.props.disabled}>
                        {this.loop(item.children,level+1)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} icon={this.handleTreeIcon} title={title} dataRef={item} disabled={this.props.disabled}></TreeNode>;
        })
    }


    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} />;
        });
    }

    setCheckedKeys = (checkedKeys) => {
        this.setState({
            checkedKeys:checkedKeys
        });
    }

    setSelectedKeys = (selectedKeys) => {
        this.setState({
            selectedKeys:selectedKeys
        });
    }

    //右击事件
    onRightClick = (e) => {
        console.info(e.node.props.dataRef);
        //先过滤没有权限的菜单
        let rightMenuList = this.props.buttons;
        if (rightMenuList && rightMenuList.length > 0) {
            let newMenuList=[];
            rightMenuList.map((item,index) => {
                if(item.isShow===undefined || item.isShow(e.node.props.dataRef,e.node.props.eventKey)){
                    newMenuList.push(item);
                }
                return item;
            });
            if(newMenuList.length>0){
                this.renderRightMenu(e, newMenuList);
            }
        } else {
            return false;
        }
    }

    //右击菜单
    renderRightMenu(e, rightMenuList) {
        if (this.popover) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.popover = null;
        }
        const content = (
            <ul className={styles.tree_menu}>
                {
                    rightMenuList.map(item =>
                        <li key={item.type} key={createUuid()}  onClick={() => item.onClick(e.node.props.dataRef,e.node.props.eventKey,e)}> {item.name}</li>
                    )
                }
            </ul>
        );
        this.popover = (
            <Popover
                placement="bottom"
                content={content}
                trigger="hover"
                defaultVisible
            >
            </Popover>
        );

        const container = this.getContainer();
        Object.assign(this.cmContainer.style, {
            position: 'absolute',
            left: `${e.event.pageX}px`,
            top: `${e.event.pageY}px`,
        });

        ReactDOM.render(this.popover, container);
    }

    getContainer() {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            document.body.appendChild(this.cmContainer);
        }
        return this.cmContainer;
    }

    render() {

        const height=this.props.search?parseInt(this.props.height)-43:parseInt(this.props.height);
        const reduceWidth=this.props.addBtn?50:20;
        return (
            <Sider className={"selector-tree-div"} style={{ background: '#fff',height: '100%' }} width={this.props.width}>

                <div className={styles.searchHeader} style={{paddingLeft: 8,paddingTop:3}}>
                    <Search
                        className={styles.searchInput}
                        placeholder="请输入查询条件"
                        onChange={this.onChange}
                        ref={(node) => { this.input = node; }}
                        style={{ width:this.props.width-reduceWidth,float:'left'}}
                    />
                    {this.props.addBtn && <Icon type="plus" className={styles.searchIcon} onClick={this.props.addBtn} />}
                </div>
                {this.state.dataList.length === 0 && <div className={styles.tree_div}>正在加载数据。。。</div>}
                {this.state.dataList.length !== 0 &&
                  <Scrollbars autoHide style={{flex: `0 0 ${this.props.width}px`,height: height}}>地方
                      <Tree
                          showIcon={this.props.showIcon}
                          checkable={this.props.checkable}
                          onExpand={this.onExpand}
                          expandedKeys={this.state.expandedKeys}
                          autoExpandParent={this.state.autoExpandParent}
                          onCheck={this.onCheck}
                          checkedKeys={this.state.checkedKeys} //选中复选框的数据
                          selectedKeys={this.state.selectedKeys} //选中节点的数据
                          onSelect={this.onSelect}
                          onRightClick={this.onRightClick}
                      >
                          {this.loop(this.state.data,1)}
                      </Tree>
                  </Scrollbars>
                }

            </Sider>
        )
    }

}

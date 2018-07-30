import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactDOM from 'react-dom';
import { Layout, Icon, Menu, Breadcrumb, Tree, Input, Popover, Tooltip } from 'antd';

import NHFetch from "../../utils/NHFetch";//封装请求
import getSize from "../../utils/getSize";
import styles from './style.css'

const { Header, Sider, Content } = Layout;
const TreeNode = Tree.TreeNode;
/*
	title:树组件
	description: 接受参数：TreeData={
								data:【树数据】,data的【属性】必须有：title,key
								search:是否展示【搜索框】,默认false,
								onRightClick:是否启动【右击菜单事件】,默认false,
								treeAdd:是否显示【添加按钮】,默认false,
							}
				===>>  该组件暂时封装同步数据树，异步加载待完善！！  <<===
	author:htd
	time:2018-2-8
*/
class NHTree extends React.Component {
    //设置可以传递参数的默认值
    static defaultProps = {
        data: [],
        sign: undefined,
        search: true,   //加搜索框
        rightMenuList: [],   //鼠标右键点击事件回调type，name，onClick（）,auth
        treeAddClick: undefined,//加号触发事件方法（）=>{}
        checkable: true,//默认开启多选框
        expandedKeys: [],	//展开指定的树节点
        autoExpandParent: true,//是否自动展开父节点
        width: 220,
        defaultSelectedKeys: [],
        disabled: false
    };
    constructor(props) {
        super(props)
        this.state = {
            selectKey: '',//选中的key
            checkedKeys: [],
            expandedKeys: [],
            checkable: true,//默认开启多选框
            searchValue: '',
            autoExpandParent: true,
            searchMode: false,
            dataList: [],				//树列表数据
            data: [],				//树数据
            search: false,				//默认【搜索框】是不展示的
            // onRightClick: false,	//默认【右击菜单事件】是不展示的
            // treeAdd: false,				//默认【添加按钮】是不展示的
            treeData: [				 //【异步】默认数据源
                { title: 'Expand to load', key: '0' },
                { title: 'Expand to load', key: '1' },
                { title: 'Tree Node', key: '2', isLeaf: true },
            ],
        }
    }

    componentDidMount() {
    }

    componentWillMount() {
        this.setState({
            search: this.props.search, //搜索框
            checkable: this.props.checkable, //默认开启多选框
            expandedKeys: this.props.expandedKeys,	//展开指定的树节点
            autoExpandParent: this.props.autoExpandParent,  //是否自动展开父节点
        })
        if (this.props.data && this.props.data.length > 0) {
            this.setState({ data: this.props.data }, () => {
                this.generateList(this.state.data);
            });
        } else {
            this.getData("sign=" + this.props.sign + "&pid=" + this.props.pid);
        }
    }
    //获取list数据
    getData = (params) => {
        NHFetch("/proData/getTreeList", "get", params)
            .then(res => {
                this.setState({ data: res.data }, () => {
                    this.generateList(this.state.data);
                });
            });
    }
    onRest = (params) => {
        this.setState({ selectKey: '', checkedKeys: [] }, () => {
            this.getData("sign=" + this.props.sign + "&pid=" + this.props.pid);
        });
    }
    componentWillUnmount() {

    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    //获取所有节点数据
    generateList = (data) => {
        let dataList = this.state.dataList;
        if (data === [] || data === undefined || data.length === 0) {
            return false;
        }
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const KEY = node.KEY;
            dataList.push({ KEY, TITLE: node.TITLE });
            this.setState({
                dataList: dataList
            })
            if (node.children) {
                this.generateList(node.children, node.KEY);
            }
        }
    };

    //查找树的父级
    getParentKey = (title, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.TITLE === title)) {
                    parentKey = node.KEY;
                } else if (this.getParentKey(title, node.children)) {
                    parentKey = this.getParentKey(title, node.children);
                }
            }
        }
        return parentKey;
    }

    //搜索输入变化事件
    onChange = (e) => {
        const value = e.target.value;
        let expandedKeys = this.state.dataList.map((item) => {

            if (item.TITLE.indexOf(value) > -1) {
                return this.getParentKey(item.TITLE, this.state.data);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        if (value == '') {

            expandedKeys = []
        }

        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    //进入搜索模式
    enterSearchMode = () => {
        if (this.state.searchMode) {
            this.setState({
                searchMode: false,
            });
        } else {
            this.setState({ searchMode: true }, () => {
                if (this.state.searchMode) {
                    this.input.focus();
                }
            });
        }
    }

    //离开搜索模式
    leaveSearchMode = () => {
        this.setState({
            searchMode: false,
            value: '',
        });
    }


    //右击事件
    onRightClick = (info) => {
        //先过滤没有权限的菜单
        let rightMenuList = this.props.rightMenuList;
        if (rightMenuList && rightMenuList.length > 0) {
            let newRightMenuList = [];
            rightMenuList.map((item, index) => {
                newRightMenuList.push(item);
            });
            if (newRightMenuList.length > 0) {
                this.setState({ selectedKeys: [info.node.props.eventKey] });
                this.renderRightMenu(info, newRightMenuList);
            }
        } else {
            return false;
        }

    }

    getContainer() {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            document.body.appendChild(this.cmContainer);
        }
        return this.cmContainer;
    }

    //右击菜单
    renderRightMenu(info, rightMenuList) {
        if (this.popover) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.popover = null;
        }
        const content = (
            <ul className="tree_menu">
                {
                    rightMenuList.map(item =>
                        <li key={item.type}
                            onClick={e => item.onClick(info)}>
                            {item.name}</li>
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
            left: `${info.event.pageX}px`,
            top: `${info.event.pageY}px`,
        });

        ReactDOM.render(this.popover, container);
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
        let len = [20, 18, 16, 14];//对应一级、二级、三级....
        return len[val - 1]
    }

    //选中事件
    onSelect = (info, e) => {
        let selectKey = "";
        let obj = {};
        if (info && info.length > 0) {
            selectKey = info[0];
            obj = e.selectedNodes[0].props;
            this.setState({ selectKey: selectKey });
        }
        if (this.props.selectTreeNode) {
            this.props.selectTreeNode(selectKey, obj.dataRef);
        }
    }
    onCheck = (info, e) => {
        this.setState({ checkedKeys: info });
        let selectKey = "";
        let arr = [];
        let objArr = [];
        if (info && info.length > 0) {
            selectKey = info;
            arr = e.checkedNodes;
            arr.map(function (obj) {
                objArr.push(obj.props);
            })
        }
        if (this.props.checkedTreeNode) {
            this.props.checkedTreeNode(selectKey, objArr);
        }
    }

    //渲染tree
    loop = (data) => {
        return data.map((item) => {
            const { searchValue } = this.state;
            let val = this.modifyTextLength(item.TITLE, this.getTextLength(item.level));
            const index = val.indexOf(searchValue);
            const beforeStr = val.substr(0, index);
            const afterStr = val.substr(index + searchValue.length);
            const titleContent = (
                <div style={{ padding: '5px' }}>
                    {item.TITLE}
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
                    <TreeNode key={item.KEY} title={title} dataRef={item} disabled={this.props.disabled}>
                        {this.loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.KEY} title={title} dataRef={item} disabled={this.props.disabled}></TreeNode>;
        })
    }

    //异步树加载函数
    onLoadData = (treeNode) => {

        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
                ];

                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            }, 1000);
        });
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
    render() {
        return (
            <Sider style={{ background: '#fff', height: '100%' }} width={this.props.width}>

                <div className={styles.searchHeader} style={{ display: this.state.search || this.props.treeAddClick ? 'block' : 'none', paddingLeft: 8 }}>
                    {this.state.search && <Icon type="search" className={styles.searchIcon} onClick={this.enterSearchMode} />}
                    <Input
                        className={styles.searchInput}
                        placeholder="请输入查询条件"
                        onChange={this.onChange}
                        // onBlur={this.leaveSearchMode}
                        ref={(node) => { this.input = node; }}
                        style={this.state.searchMode == true ? { width: this.props.treeAddClick ? this.props.width - 72 : this.props.width - 52, marginRight: 10 } : { width: '0', margin: 0 }}
                    />
                    {this.props.treeAddClick && <Icon type="plus" className={styles.searchIcon} onClick={this.props.treeAddClick} />}
                </div>
                {this.state.dataList.length == 0 && <div className={styles.tree_div}>The tree is No Date!</div>}

                {/* 同步树 */}
                <Scrollbars autoHide style={{ flex: `0 0 ${this.props.width}px`, height: this.props.height ? this.props.height : (getSize().windowH - 163) }}>
                    <Tree
                        checkable={this.state.checkable}
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        onRightClick={this.onRightClick}
                        defaultSelectedKeys={this.props.defaultSelectedKeys}
                    >
                        {this.loop(this.state.data)}
                    </Tree>
                </Scrollbars>
                {/* 异步树 */}
                {/* <Tree loadData={this.onLoadData}>
					{this.renderTreeNodes(this.state.treeData)}
				</Tree> */}
            </Sider>
        )
    }

}

export default NHTree;
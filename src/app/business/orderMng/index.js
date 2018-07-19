import React from 'react';
import {  Button , Icon ,Radio , Menu , Dropdown ,Row , Col} from 'antd';
import styleCss from './index.css';
import DetailCard from './detailCard';
import { createUuid } from '../../../utils/NHCore';

export default class Order extends React.Component{

    constructor(props){
        super(props);
        this.state={
            loading:false,
            list:[{
                ddh:'1201806290032',//订单号
                zt:'1',//状态
                xm:'周珊',//姓名
                lxdh:'13111111111',//联系电话
                psdz:'湖南省株洲市荷塘区溢香园3栋502室',//配送地址
                pssj:'2018-07-15 16:00',//配送时间
                dgsp:'全套红木家具，含：一桌六椅，一桌六',//订购的商品
                zzsj:'¥18,000.00',//最终售价
                yj:'¥20,000.00',//原价
                zbsj:'15',//需要准备的时间
                dgmc:'刘艺',//导购
            },{
                ddh:'1201806290032',//订单号
                zt:'1',//状态
                xm:'周珊',//姓名
                lxdh:'13111111111',//联系电话
                psdz:'湖南省株洲市荷塘区溢香园3栋502室',//配送地址
                pssj:'2018-07-15 16:00',//配送时间
                dgsp:'全套红木家具，含：一桌六椅，一桌六',//订购的商品
                zzsj:'¥18,000.00',//最终售价
                yj:'¥20,000.00',//原价
                zbsj:'15',//需要准备的时间
                dgmc:'刘艺',//导购
            },{
                ddh:'1201806290032',//订单号
                zt:'1',//状态
                xm:'周珊',//姓名
                lxdh:'13111111111',//联系电话
                psdz:'湖南省株洲市荷塘区溢香园3栋502室',//配送地址
                pssj:'2018-07-15 16:00',//配送时间
                dgsp:'全套红木家具，含：一桌六椅，一桌六',//订购的商品
                zzsj:'¥18,000.00',//最终售价
                yj:'¥20,000.00',//原价
                zbsj:'15',//需要准备的时间
                dgmc:'刘艺',//导购
            },{
                ddh:'1201806290032',//订单号
                zt:'1',//状态
                xm:'周珊',//姓名
                lxdh:'13111111111',//联系电话
                psdz:'湖南省株洲市荷塘区溢香园3栋502室',//配送地址
                pssj:'2018-07-15 16:00',//配送时间
                dgsp:'全套红木家具，含：一桌六椅，一桌六',//订购的商品
                zzsj:'¥18,000.00',//最终售价
                yj:'¥20,000.00',//原价
                zbsj:'15',//需要准备的时间
                dgmc:'刘艺',//导购
            },{
                ddh:'1201806290032',//订单号
                zt:'1',//状态
                xm:'周珊',//姓名
                lxdh:'13111111111',//联系电话
                psdz:'湖南省株洲市荷塘区溢香园3栋502室',//配送地址
                pssj:'2018-07-15 16:00',//配送时间
                dgsp:'全套红木家具，含：一桌六椅，一桌六',//订购的商品
                zzsj:'¥18,000.00',//最终售价
                yj:'¥20,000.00',//原价
                zbsj:'15',//需要准备的时间
                dgmc:'刘艺',//导购
            }
            ,{
                ddh:'1201806290032',//订单号
                zt:'1',//状态
                xm:'周珊',//姓名
                lxdh:'13111111111',//联系电话
                psdz:'湖南省株洲市荷塘区溢香园3栋502室',//配送地址
                pssj:'2018-07-15 16:00',//配送时间
                dgsp:'全套红木家具，含：一桌六椅，一桌六',//订购的商品
                zzsj:'¥18,000.00',//最终售价
                yj:'¥20,000.00',//原价
                zbsj:'15',//需要准备的时间
                dgmc:'刘艺',//导购
            }
            ]
        }
    }

    /**
     * 加载更多按钮点击事件
     */
    fetchMore = () => {
        this.setState({loading:true});
        let temList=this.state.list;
        let list = this.state.list;
        temList.map((item) => {
            list.push(item);
            return item;
        });
        this.setState({
            loading:false,
            list:list,
        });
    }

    render(){
        const menu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" >已发货</a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" >已确认收货</a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" >已完成</a>
              </Menu.Item>
            </Menu>
        );
        //待加载的数据
        let list = [];
        const dataList = this.state.list;
        for (let i =0 ;i< dataList.length;){
            list.push(<Row key={createUuid()}>
                <Col span={8} className={styleCss.c09}>{dataList[i]?<DetailCard data = {dataList[i]}/>:''}</Col>
                <Col span={8} className={styleCss.c09}>{dataList[i+1]?<DetailCard data = {dataList[i+1]}/>:''}</Col>
                <Col span={8} className={styleCss.c09} style={{paddingRight:'15px'}}>{dataList[i+2]?<DetailCard data = {dataList[i+2]}/>:''}</Col>
            </Row>);
            i=i+3;
        }

        return (
            <div className={styleCss.c01}>
                <div className={styleCss.c02}>
                    <div className={styleCss.c04}>
                        <div className={styleCss.c06}>商品发货情况查看</div>
                        <div className={styleCss.c07}>确认之后请注意项目交货时间并按时交货。</div>
                    </div>
                    <div className={styleCss.c05}>
                        <div className={styleCss.c08}>
                            <Radio.Group  onChange={this.handleSizeChange}>
                                <Radio.Button value="large">全部</Radio.Button>
                                <Radio.Button value="default">待确认</Radio.Button>
                                <Radio.Button value="small">已确认</Radio.Button>
                                <Dropdown overlay={menu} placement="bottomRight">
                                    <Radio.Button value="other">..</Radio.Button>
                                </Dropdown>
                            </Radio.Group>
                        </div>
                    </div>
                </div>
                <div className={styleCss.c03} style={{minHeight:this.props.minHeight-100}}>
                    {list}
                    <div className={styleCss.c10}>
                        <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
                            {this.state.loading ? (
                            <span>
                                <Icon type="loading" /> 加载中...
                            </span>
                            ) : (
                            '加载更多'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
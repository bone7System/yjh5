import React,{Fragment} from "react";
import {InputNumber, Table, Button, Input, message, Popconfirm, Divider, Card,DatePicker } from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import {createUuid} from '../../../utils/NHCore';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import styles from './style.less';


class EditInitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          data:this.props.formInitData?this.props.formInitData:[],
          loading: false,
          ids:[],
        }
    }

    componentWillReceiveProps(nextProps, preState){
      if (isEqual(nextProps.items, this.state.items)) {
        return null;
      }
      let items=nextProps.items?nextProps.items:[];
      let data=[];
      items.map((item,index) => {
        let count2=item.count2?parseInt(item.count2):0;
        //只展示未交付的数据
        if(count2!==0){
          data.push({
            key:createUuid(),
            cgrownum:item.rownum,
            spbm:item.spbm,
            count2:item.count2
          });
        }
        return item;
      });
      this.setState({
        data:data,
        items:nextProps.items
      });
    }
    // static getDerivedStateFromProps(nextProps, preState) {
    //   if (isEqual(nextProps.value, preState.value)) {
    //     return null;
    //   }
    //   return {
    //     data: nextProps.value
    //   };
    // }

    getRowByKey(key, newData) {
      const { data } = this.state;
      return (newData || data).filter(item => item.key === key)[0];
    }


    handleFieldChange(e, fieldName, key) {
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = e.target.value;
        this.setState({ data: newData });
      }
      this.props.onChange && this.props.onChange(newData);
    }
    handleNumberFieldChange(value, fieldName, key) {
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = value;
        this.setState({ data: newData },() => {
          this.props.onChange && this.props.onChange(newData);
        });
      }

    }

    NHInputNunber = (text,record,fieldName,key,title) => {
      return (
        <InputNumber
          value={text}
          min={0}
          onChange={e => this.handleNumberFieldChange(e, fieldName, key)}
          placeholder={title}
        />
      );
    }

    render() {
        const columns = [
          {
            title: '商品编码',
            dataIndex: 'spbm',
            key: 'spbm',
            width: '120px',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: '入库仓位',
            dataIndex: 'cw',
            key: 'cw',
            // width: '20%',
            render: (text, record) => {
              return this.NHInputNunber(text,record,'cw',record.key,'入库仓位');
            },
          },
          {
            title: '入库数量',
            dataIndex: 'count',
            key: 'count',
            // width: '20%',
            render: (text, record) => {
              return <InputNumber
                        value={text}
                        min={0}
                        max={record.count2}
                        onChange={e => this.handleNumberFieldChange(e, 'count', record.key)}
                        onKeyPress={e => this.handleKeyPress(e,record.key)}
                        placeholder={'入库数量'}
                      />;
            },
          },
          {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            // width: '20%',
            render: (text, record) => {
              return <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, 'remark', record.key)}
                        placeholder={'备注'}
                      />;
            },
          }
        ];

        const { loading, data } = this.state;
        return (
          <Card title="入库详情" style={{marginBottom: '24px'}} bordered={false}>
            <Fragment>
              <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                pagination={false}
                rowClassName={styles.editable}
              />
            </Fragment>
          </Card>
        );
    }
}


export default EditInitForm;

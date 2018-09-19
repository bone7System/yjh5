import React,{Fragment} from "react";
import {InputNumber, Table, Button, Input, message, Popconfirm, Divider, Card,DatePicker } from 'antd';
import NHFormItem from '../../../components/NHFormItem';
import NHSelect from '../../../components/NHSelect';
import {createUuid} from '../../../utils/NHCore';
import moment from 'moment';
import styles from './style.less';


class EditInitForm extends React.Component {

  index = 0;

  cacheOriginData = {};

    constructor(props) {
        super(props);
        this.state = {
          data:this.props.formInitData?this.props.formInitData:[],
          loading: false,
          ids:[],
        }
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

    toggleEditable = (e, key) => {
      e.preventDefault();
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        // 进入编辑状态时保存原始数据
        if (!target.editable) {
          this.cacheOriginData[key] = { ...target };
        }
        target.editable = !target.editable;
        this.setState({ data: newData });
      }
    };

    newMember = () => {
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      newData.push({
        key: createUuid(),
        editable: true,
        isNew: true,
      });
      this.index += 1;
      this.setState({ data: newData });
    };

    remove(key) {
      const { data,ids } = this.state;
      const { onChange } = this.props;
      const newData = data.filter(item => item.key !== key);
      const delData = data.filter(item => item.key === key);
      if(delData[0].id){
        ids.push(delData[0].id);
      }
      this.setState({ data: newData,ids:ids});
      onChange(newData,ids);


    }

    handleKeyPress(e, key) {
      if (e.key === 'Enter') {
        this.saveRow(e, key);
      }
    }

    handleFieldChange(e, fieldName, key) {
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = e.target.value;
        this.setState({ data: newData });
      }
    }
    handleNumberFieldChange(value, fieldName, key) {
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = value;
        if(target.count && target.count1 ){
          target.count2=parseInt(target.count)-parseInt(target.count1);
        }
        this.setState({ data: newData });
      }
    }

    handleDateFieldChange(date, dateString, fieldName, key) {
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = date;
        this.setState({ data: newData });
      }
    }

    saveRow(e, key) {
      e.persist();
      this.setState({
        loading: true,
      });
      setTimeout(() => {
        if (this.clickedCancel) {
          this.clickedCancel = false;
          return;
        }
        const target = this.getRowByKey(key) || {};
        if (!target.unitprice || !target.spbm || !target.count || !target.kbetr
         || !target.count1 || !target.zwsj) {
          message.error('请填写完整信息。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
        delete target.isNew;
        this.toggleEditable(e, key);
        const { data } = this.state;
        const { onChange } = this.props;
        onChange(data);
        this.setState({
          loading: false,
        });
      }, 500);
    }

    cancel(e, key) {
      this.clickedCancel = true;
      e.preventDefault();
      const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (this.cacheOriginData[key]) {
        Object.assign(target, this.cacheOriginData[key]);
        delete this.cacheOriginData[key];
      }
      target.editable = false;
      this.setState({ data: newData });
      this.clickedCancel = false;
    }

    NHInput = (text,record,fieldName,key,title)=> {
      if (record.editable) {
        return (
          <Input
            value={text}
            autoFocus
            onChange={e => this.handleFieldChange(e, fieldName, key)}
            onKeyPress={e => this.handleKeyPress(e,key)}
            placeholder={title}
          />
        );
      }
      return text;
    }
    NHInputNunber = (text,record,fieldName,key,title) => {
      if (record.editable) {
        return (
          <InputNumber
            value={text}
            min={0}
            onChange={e => this.handleNumberFieldChange(e, fieldName, key)}
            onKeyPress={e => this.handleKeyPress(e,key)}
            placeholder={title}
          />
        );
      }
      return text;
    }

    render() {
        const columns = [
          {
            title: '商品编码',
            dataIndex: 'spbm',
            key: 'spbm',
            width: '120px',
            render: (text, record) => {
              return this.NHInput(text,record,'spbm',record.key,'商品编码');
            },
          },
          {
            title: '单价',
            dataIndex: 'unitprice',
            key: 'unitprice',
            // width: '20%',
            render: (text, record) => {
              return this.NHInputNunber(text,record,'unitprice',record.key,'单价');
            },
          },
          {
            title: '价格',
            dataIndex: 'kbetr',
            key: 'kbetr',
            // width: '20%',
            render: (text, record) => {
              return this.NHInputNunber(text,record,'kbetr',record.key,'价格');
            },
          },
          {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            // width: '20%',
            render: (text, record) => {
              return this.NHInputNunber(text,record,'count',record.key,'数量');
            },
          },
          {
            title: '已交付数量',
            dataIndex: 'count1',
            key: 'count1',
            // width: '20%',
            render: (text, record) => {
              return this.NHInputNunber(text,record,'count1',record.key,'已交付数量');
            },
          },
          {
            title: '最晚交货日期',
            dataIndex: 'zwsj',
            key: 'zwsj',
            render: (text, record) => {
              if (record.editable) {
                return (
                  <DatePicker
                    value={moment(new Date(text),'YYYY-MM-DD')}
                    format={'YYYY-MM-DD'}
                    onChange={(date, dateString) => this.handleDateFieldChange(date, dateString, 'zwsj', record.key)}
                    onKeyPress={e => this.handleKeyPress(e, record.key)}
                    placeholder="最晚交货日期"
                  />
                );
              }
              return new Date(text).valueOf();
            }
          },
          {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
            // width: '20%',
            render: (text, record) => {
              return this.NHInput(text,record,'remark',record.key,'描述');
            },
          },
          {
            title: '操作',
            key: 'action',
            render: (text, record) => {
              const { loading } = this.state;
              if (!!record.editable && loading) {
                return null;
              }
              if (record.editable) {
                if (record.isNew) {
                  return (
                    <span>
                      <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                      <Divider type="vertical" />
                      <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                        <a>删除</a>
                      </Popconfirm>
                    </span>
                  );
                }
                return (
                  <span>
                    <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                    <Divider type="vertical" />
                    <a onClick={e => this.cancel(e, record.key)}>取消</a>
                  </span>
                );
              }
              return (
                <span>
                  <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            },
          },
        ];

        const { loading, data } = this.state;
        return (
          <Card title="订单详情" style={{marginBottom: '24px'}} bordered={false}>
            <Fragment>
              <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                pagination={false}
                rowClassName={record => (record.editable ? styles.editable : '')}
              />
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="dashed"
                onClick={this.newMember}
                icon="plus"
              >
                新增成员
              </Button>
            </Fragment>
          </Card>
        );
    }
}


export default EditInitForm;

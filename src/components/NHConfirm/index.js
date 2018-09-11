import { Modal } from 'antd';
const confirm = Modal.confirm;

//确认对话框
export default function NHConfirm(pContent, pOnOk, pType, pOnCancel) {
  var content=undefined;
  var onOk=undefined;
  var type=undefined;
  var onCancel=undefined;
  if ((typeof pContent) === 'string') {
      content = pContent ? pContent : '请填写内容描述';
      type = pType ? pType : 'normal';
      onOk = pOnOk ? pOnOk : () => {
      };
      onCancel = pOnCancel ? pOnCancel : () => {
      };
  } else {
      let params = pContent;
      content = params.content ? params.content : '请填写内容描述';
      type = params.type ? params.type : 'normal';
      onOk = params.onOk ? params.onOk : () => {};
      onCancel = params.onCancel ? params.onCancel : () => {
      };
  }

  const title = '提示';
  let okType = 'primary'; //默认确认按钮类型
  let iconType = 'question-circle'; //问号
  if (type === 'warn') { //警告类型操作提示
      okType = 'danger';
      iconType = 'info-circle';
  } else if (type === 'danger') { //危险类型操作提示
      okType = 'danger';
      iconType = 'exclamation-circle';
  }

  confirm({
      title: title,
      content: content,
      okText: '确定',
      cancelText: '取消',
      okType: okType,
      iconType: iconType,
      onOk() {
          onOk();
      },
      onCancel() {
          onCancel();
      },
  });
}

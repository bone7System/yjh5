/**
 * 输入控件常用常量
 * Author: zengxiangkai@ly-sky.com
 * Created on: 2018-02-05 15:06:15
 * Version: 1.0
 * Modify log:
 */

//输入控件类型常量
export const InputType = {
    INPUT: 'input', //单行文本输入控件类型
    INPUTNUMBER: 'inputnumber', //数字输入控件类型
    TEXTAREA: 'textarea', //多行文本输入控件类型
    SELECT: 'select', //下拉选择器类型
    RADIO: 'radio', //单选框类型
    CHECKBOX: 'checkbox', //多选框类型
    SWITCH: 'switch', //开关类型
    UPLOAD: 'upload', //上传控件类型
};

//控件宽度类型
export const WidthType = {
    DEFAULT: 'default', //默认，自适应
    RELATIVE: 'relative', //相对宽度，百分比
    FIXED: 'fixed' //固定宽度，像素
}

//正则表达式常量
export const RegularExpression = {
    NUMBER: { describe: "数字", rule: { pattern: "^[0-9]*$", message: "请输入数字" } },
    CN_CHARACTERS: { describe: "汉字", rule: { pattern: "^[\u4e00-\u9fa5]{0,}$", message: "请输入汉字" } },
    EN_CHARACTERS: { describe: "英文", rule: { pattern: "^[A-Za-z]+$", message: "请输入英文" } },
    EN_NUMBER_UNDERLINE: { describe: "英文、数字或下划线", rule: { pattern: "^\\w+$", message: "请输入英文、数字或下划线" } },
    EN_NUMBER: { describe: "英文或数字", rule: { pattern: "^[A-Za-z0-9]+$", message: "请输入英文或数字" } },
    EMAIL: { describe: "邮箱地址", rule: { pattern: "^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", message: "请输入正确的邮箱地址" } },
    MOBILE_PHONE_NUMBER: { describe: "手机号码", rule: { pattern: "^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$", message: "请输入正确的手机号码" } },
    PHONE_NUMBER: { describe: "电话号码", rule: { pattern: "\d{3}-\d{8}|\d{4}-\d{7}", message: "请输入正确的电话号码" } },
    IDCARD: { describe: "身份证号码", rule: { pattern: "^([1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3})|([1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|(\\d{3}[X])))$", message: "请输入正确的身份证号" } },
    QQ: { describe: "QQ号码", rule: { pattern: "[1-9][0-9]{4,}", message: "请输入正确的QQ号" } },
    POSTAL_CODE: { describe: "邮政编码", rule: { pattern: "[1-9]\d{5}(?!\d)", message: "请输入正确的邮政编码" } }
}

export default InputType;
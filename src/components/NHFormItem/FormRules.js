const FormRules = {
    //身份证号验证
    IDCAR_RULE: {
        pattern: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|(\d{3}[X])))$/,
        message: "请输入正确的身份证号"
    },
    NUMBER: { pattern: /^[0-9]*$/, message: "请输入数字" },
    CN_CHARACTERS: { pattern: /^[\u4e00-\u9fa5]{0,}$/, message: "请输入汉字" },
    EN_CHARACTERS: { pattern: /^[A-Za-z]+$/, message: "请输入英文" },
    EN_NUMBER_UNDERLINE: { pattern: /^\\w+$/, message: "请输入英文、数字或下划线" },
    EN_NUMBER: { pattern: /^[A-Za-z0-9]+$/, message: "请输入英文或数字" },
    EMAIL: { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "请输入正确的邮箱地址" },
    MOBILE_PHONE_NUMBER: {
        pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
        message: "请输入正确的手机号码"
    },
    PHONE_NUMBER: { pattern: /\d{3}-\d{8}|\d{4}-\d{7}/, message: "请输入正确的电话号码" },
    QQ: { pattern: /[1-9][0-9]{4,}/, message: "请输入正确的QQ号" },
    POSTAL_CODE: { pattern: /[1-9]\d{5}(?!\d)/, message: "请输入正确的邮政编码" }

};
export default FormRules;
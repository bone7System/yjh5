import NHFetch from '../../../utils/NHFetch'; 
const getSelectName = (sign, values) => { 
    return NHFetch('/proData/getSelectName', 'get', { sign: sign, values: (typeof values) == 'string' ? values : values.join(',') }).then(res => { 
        if (res) { return res.data; } return ''; }); 
    } 
export default getSelectName;


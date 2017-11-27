/**
 * Created by zhangchuan on 2017/9/23.
 */

/**
 * 将参数对象转化为post参数.
 * @param  {[Object]} params [参数]
 * @return {{}}        [post参数]
 */
export const getFormHeader = () => {
    let header = {};
    header["content-type"] = "application/x-www-form-urlencoded";
    return header;
};


/**
 * 转换表单参数为字符串
 * @param params
 * @param compact
 * @returns {string}
 */
export const getPostParams = (params, compact) => {
    let result = "";
    if (!compact) {
        for(let key in params) {
            result = `${result}&${key}=${encodeURIComponent(params[key])}`;
        }
    }
    else {
        for(let key in params) {
            if (params[key] !== null) {
                result = `${result}&${key}=${encodeURIComponent(params[key])}`;
            }
        }
    }
    return result.substr(1);
};


/***
 * 获取url中指定键值的参数
 * @param name
 * @returns {*}
 */
export const getUrlParam = name => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
};

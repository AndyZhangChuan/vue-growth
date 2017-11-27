/**
 * Created by zhangchuan on 2017/10/2.
 */
import * as CONSTANTS from '../constants';
import {getUrlParam} from './index'

export const pushSignCode = code => {
    let codeList = getCodeList();
    if(codeList.length > 0){
        sessionStorage.setItem(CONSTANTS.USER_SIGNATURE_CODE, `${codeList[0]},${code}`)
    }else{
        sessionStorage.setItem(CONSTANTS.USER_SIGNATURE_CODE, code);
    }
};

export const getSignCodeInfo = () => {
    let codeList = getCodeList();
    return {
        head_signature: codeList.length >0 ? codeList[0] : 'none',
        tail_signature: codeList.length >0 ? codeList[codeList.length - 1] : 'none'
    }
};

const getCodeList = () => {
    let codeStr = sessionStorage.getItem(CONSTANTS.USER_SIGNATURE_CODE);
    return codeStr ? codeStr.split(",") : [];
};

export const initSignCode = () => {
    let initSignCode = getUrlParam('signCode');
    initSignCode && pushSignCode(initSignCode);
};
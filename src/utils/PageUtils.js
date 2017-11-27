/**
 * Created by zhangchuan on 2017/9/25.
 */
import * as CONSTANTS from '../constants';
import * as Sha1Utils from './Sha1Utils';
import * as baseAction from '../actions';
import * as DeviceUtils from './DeviceUtils';
import * as ABUtils from './ABUtils';
import {getSignCodeInfo} from './SignCode';
import options from '../constants/options';

export const getFromPage=() => {
    let name = sessionStorage.getItem(CONSTANTS.FROM_PAGE_NAME) ? sessionStorage.getItem(CONSTANTS.FROM_PAGE_NAME) : -1;
    let path = sessionStorage.getItem(CONSTANTS.FROM_PAGE_PATH) ? sessionStorage.getItem(CONSTANTS.FROM_PAGE_PATH) : -1;
    return {name:name, path:path};
};
export const getCurrentRouterPath = () =>{
    let path = window.location.href.split("#")[1];
    return path? path: ''
};
export const getCurrentPage=() => {
    let name = sessionStorage.getItem(CONSTANTS.CURRENT_PAGE_NAME) ? sessionStorage.getItem(CONSTANTS.CURRENT_PAGE_NAME) : -1;
    let path = sessionStorage.getItem(CONSTANTS.CURRENT_PAGE_PATH) ? sessionStorage.getItem(CONSTANTS.CURRENT_PAGE_PATH) : -1;
    return {name:name, path:path};
};
export const getPageHash = () => {
    return sessionStorage.getItem(CONSTANTS.PAGE_HASH) ? sessionStorage.getItem(CONSTANTS.PAGE_HASH) : -1;
};

export const rejectTransaction = (route) => {
    sessionStorage.setItem(CONSTANTS.LOG_TRANSACTION, route.name);
};
export const checkTransactionOpen = (route) => {
    return sessionStorage.getItem(CONSTANTS.LOG_TRANSACTION) != route.name;
};

/**
 * 提交埋点日志
 */
export const commitTransaction = () => {

    // get public data includes from_page and current_page
    getEmbedLogPublicInfo().then(logInfo => {
        logInfo.log_type = CONSTANTS.LOG_TYPE_PAGE;
        
        // 上传埋点信息
        baseAction.sendEmbedLog(logInfo);
    });

};

/**
 * get public data
 */
export const getEmbedLogPublicInfo = () => {
    return new Promise(resolve => {
        let infoObj = options.state.PAGE_PATH_INFO;
        let currentPage = getCurrentPage(),
            fromPage = getFromPage();
        
        infoObj.user_id = options.getState().USER_ID;
        infoObj.current_page_name = currentPage.name;
        infoObj.current_page_path = currentPage.path;
        infoObj.from_page_name = fromPage.name;
        infoObj.from_page_path = fromPage.path;
        infoObj.page_hash = getPageHash();
        infoObj.page_visit_session = getPageVisitSession();
        infoObj.client_timestamp = new Date().getTime();
        infoObj.project_name = options.getState().PROJECT_NAME;

        // add custom data
        for(let key of Object.keys(options.state.CUSTOM_PUBLIC_DATA)){
            infoObj[key.toLowerCase()] = options.state.CUSTOM_PUBLIC_DATA[key];
        }

        // get page private buried data and signCode
        infoObj = {...infoObj, ...getPagePrivateData(), ...getSignCodeInfo()};
        
        DeviceUtils.getDeviceInfo().then(data => {
            data && (infoObj = {...infoObj, ...data});
            resolve(infoObj);
        });
    });

};

export const setPageHistoryInfo = route => {
    let logKeys = options.state.CUSTOM_ROUTER_LOG_PARAMS;

    // 1.init log data
    let path = getCurrentRouterPath();
    setPathHistoryLog(route.name, path);

    // 2. get public data
    let embedObj = {};
    logKeys.map((key, index) => {
        if(route.params && key in route.params){
            embedObj[key] = route.params[key];
        }else if(route.query && key in route.query){
            embedObj[key] = route.query[key];
        }
    });
    let abtest = ABUtils.getABTestKey();
    if (abtest) {
        embedObj['abtest'] = abtest;
        embedObj['abtestkey'] = Sha1Utils.hex_sha1(abtest);
    }
    options.setState({PAGE_PATH_INFO: embedObj});
    
};

export const setPagePrivateData = data => {
    options.setState({PAGE_PRIVATE_DATA: data});
};

export const getPagePrivateData = () => {
    let pageData = options.state.PAGE_PRIVATE_DATA ? options.state.PAGE_PRIVATE_DATA : -1;
    return pageData == -1 ? {} : pageData;
};

export const clearPagePrivateData = () => {
    options.setState({PAGE_PRIVATE_DATA: {}});
};

export const getPageVisitSession = () => {
    return sessionStorage.getItem(CONSTANTS.PAGE_VISIT_SESSION) ? sessionStorage.getItem(CONSTANTS.PAGE_VISIT_SESSION) : -1;
};

export const setPathHistoryLog= (pageName, pagePath) => {
    let currentPage = getCurrentPage();
    if(currentPage.name != -1){
        sessionStorage.setItem(CONSTANTS.FROM_PAGE_NAME, currentPage.name);
        sessionStorage.setItem(CONSTANTS.FROM_PAGE_PATH, currentPage.path);
    }
    let userId = sessionStorage.getItem(CONSTANTS.SESSION_ID);
    sessionStorage.setItem(CONSTANTS.PAGE_HASH, Sha1Utils.hex_sha1(pageName+userId+new Date().getTime()));

    // set session id
    if (getPageVisitSession() == -1){
        sessionStorage.setItem(CONSTANTS.PAGE_VISIT_SESSION, Sha1Utils.hex_sha1(CONSTANTS.PAGE_VISIT_SESSION+userId+new Date().getTime()));
    }
    sessionStorage.setItem(CONSTANTS.CURRENT_PAGE_NAME, pageName);
    sessionStorage.setItem(CONSTANTS.CURRENT_PAGE_PATH, encodeURIComponent(pagePath));
};

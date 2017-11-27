/**
 * Created by zhangchuan on 2017/9/25.
 */
import * as baseAction from '../actions';
import * as CONSTANTS from '../constants';
import * as PageUtils from '../utils/PageUtils';

export const addActionLog = (logKey, logData) => {
    submitEmbedLog(logKey, logData);
};

/**
 * 记录埋点日志
 * @param logKey 键值
 * @param data 数据字段
 * @param extraData 其他埋点信息
 */
export const submitEmbedLog = (logKey, data, extraData) => {
    // 1. 获取买埋点公共信息包含来源页和当前页
    PageUtils.getEmbedLogPublicInfo().then(logInfo => {
        // 2 封装动作埋点信息
        logInfo.action = logKey;
        logInfo.log_type = CONSTANTS.LOG_TYPE_ACTION;
        if (data){
            for(let key in data){
                logInfo[key] = data[key];
            }
        }
        // 3.封装extraData
        extraData && (logInfo.extra = JSON.stringify(extraData));
        // 4. 上传埋点信息
        baseAction.sendEmbedLog(logInfo);
    });

};

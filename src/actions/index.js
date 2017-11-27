/**
 * Created by zhangchuan on 2017/9/23.
 */

import options from '../constants/options';
import * as Utils from '../utils';

/**
 * 上传埋点日志
 * @param form
 * @returns {Promise}
 */
export const sendEmbedLog = (form) => {
    if(options.state.ENABLED){
        options.state.DEBUG && console.log(form);
        return new Promise( resolve => {
            fetch(`${options.state.LOG_SUBMIT_URL}`, {
                method: 'post',
                headers: Utils.getFormHeader(),
                body: Utils.getPostParams(form)
            })
              .then(response => response.json())
              .then(json => {
                  resolve(json);
              });
        });
    }
};

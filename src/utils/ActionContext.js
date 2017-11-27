/**
 * Created by zhangchuan on 2017/9/23.
 */
import * as CONSTANTS from '../constants';


export default {

    setDeviceInfo: info => {
        sessionStorage.setItem(CONSTANTS.USER_DEVICE_INFO, JSON.stringify(info));
    },

    getDeviceInfo: () => JSON.parse(sessionStorage.getItem(CONSTANTS.USER_DEVICE_INFO))

}

/**
 * Created by zhangchuan on 2017/9/23.
 */

import ActionContext from './ActionContext';
import { getLocation } from './Geolocation';
import { getAgent } from './Agent';
import getUUID from './UUID';


export const getDeviceInfo = () => {
    return new Promise( resolve => {
        if(ActionContext.getDeviceInfo() != null){
            resolve(ActionContext.getDeviceInfo());
            return;
        }
        let params = {
            uuid: getUUID(),
            platform: getAgent(),
            agent: navigator.userAgent
        };
        getLocation().then(geoInfo => {
            resolve(ActionContext.getDeviceInfo({
                ...params,
                ...geoInfo
            }));
        }).catch(() => {
            resolve(params)
        });

    });
};

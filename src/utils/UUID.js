/**
 * Created by zhangchuan on 2017/10/2.
 */
import * as Sha1Utils from '../utils/Sha1Utils';


const getUUID = () => {
    if (localStorage.getItem('device_uuid')) return localStorage.getItem('device_uuid');
    let uuid = Sha1Utils.hex_sha1(new Date().getTime() + '' + parseInt(Math.random() * 10000000));
    localStorage.setItem('device_uuid', uuid);
    return uuid;
};

export default getUUID

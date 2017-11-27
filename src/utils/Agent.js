/**
 * Created by zhangchuan on 2017/10/2.
 */
const WECHAT = 'wechat';
const IOS = 'iOS';
const ANDROID = 'android';
const WEB = 'web';

const types = {
    WECHAT,
    IOS,
    ANDROID,
    WEB
};

const getAgent = () => {
    const ua = navigator.userAgent;

    if (/MicroMessenger/i.test(ua)) return WECHAT;

    if (/(iPhone|iPod|iPad)/i.test(ua)) return IOS;

    return ANDROID;
};

export {
  getAgent,
  types,
}

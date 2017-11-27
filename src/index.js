/**
 * Created by Andy on 2017/9/25.
 */

import vueLog from './directives/v-log';
import track from './track'
import * as PageUtils  from './utils/PageUtils';
import * as LogUtils from './utils/LogUtils';
import {initSignCode, pushSignCode} from './utils/SignCode';
import {setOptions, setUserId} from './utils/Options';



const install = Vue => {
    if(install.installed) return;
    initSignCode();
    Vue.directive('log', vueLog);
    
};

export default {
    install,
    track,
    pushSignCode,
    setOptions,
    setUserId,
    ...PageUtils,
    ...LogUtils
}


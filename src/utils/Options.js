/**
 * Created by zhangchuan on 2017/9/23.
 */

import options from '../constants/options';

export const setOptions = params => {
    options.setState(params);
};

export const setUserId = userId => {
    options.setState({USER_ID: userId});
};

export const setCustomPublicData = data => {
   options.setState({CUSTOM_PUBLIC_DATA: {...options.state.CUSTOM_PUBLIC_DATA, ...data}});
};
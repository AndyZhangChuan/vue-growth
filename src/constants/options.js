/**
 * Created by zhangchuan on 2017/9/23.
 */
const options = {
    state: {
        CUSTOM_ROUTER_LOG_PARAMS: [],
        LOG_SUBMIT_URL: '/',
        LAZY_ROUTERS: [],
        PROJECT_NAME: '',
        ENABLED: true,
        DEBUG: false,
        USER_ID: 0,
        PAGE_PRIVATE_DATA: {},
        PAGE_PATH_INFO: {},
        CUSTOM_PUBLIC_DATA: {}
    },

    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
    },

    getState() {
        return { ...this.state };
    },

    clear(keys) {
        if (typeof keys === 'string' && this.state[keys]) {
            delete this.state[keys];
            return;
        }

        keys.forEach(key => {
            if (this.state[key]) {
                delete this.state[key];
            }
        });
    }
};

export default options
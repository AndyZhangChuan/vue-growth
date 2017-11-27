/**
 * Created by zhangchuan on 2017/9/23.
 */
import * as PageUtils from './utils/PageUtils';
import options from './constants/options';

const track = router => {
    router.afterEach(route => {
        PageUtils.clearPagePrivateData();
        PageUtils.setPageHistoryInfo(route);
        
        if(!options.state.LAZY_ROUTERS || options.state.LAZY_ROUTERS.indexOf(route.name) == -1){
            PageUtils.commitTransaction(route);
        }
    });

    return router
};

export default track

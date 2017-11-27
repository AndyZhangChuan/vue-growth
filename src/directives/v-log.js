/**
 * Created by Andy on 2017/8/13.
 */
import * as CONSTANTS from '../constants';
import {addActionLog} from '../utils/LogUtils';


const logEngine = {
    global: {
        domUuid: 1,
        InternalKeyName: 'vueLogInternalKey'
    },
    domCaches: {

    },
    config: {
        maxSingleTapTimeInterval: 300,
        maxSingleTapPageDistanceSquared: 25,
        minLongTapTimeInterval: 700,
        maxDoubleTapTimeInterval: 300,
        maxDoubleTapPageDistanceSquared: 64,
        gestureEventsToClick: [CONSTANTS.EVENT_TAP, CONSTANTS.EVENT_LONG_TAP, CONSTANTS.EVENT_TOUCH_START],
        eventHandler: addActionLog
    },
    util: {
        checkSwipeDown (ctx, e, touch) {
            if(!ctx[CONSTANTS.EVENT_SWIPE](e, touch)) return false;

            return touch.pageYDistance > 0 && Math.abs(touch.pageYDistance) > Math.abs(touch.pageXDistance);
        },
        checkSwipeUp (ctx, e, touch) {
            if(!ctx[CONSTANTS.EVENT_SWIPE](e, touch)) return false;

            return touch.pageYDistance < 0 && Math.abs(touch.pageYDistance) > Math.abs(touch.pageXDistance);
        },
        checkSwipeLeft(ctx, e, touch) {
            if(!ctx[CONSTANTS.EVENT_SWIPE](e, touch)) return false;

            return touch.pageXDistance < 0 && Math.abs(touch.pageXDistance) > Math.abs(touch.pageYDistance);
        },
        checkSwipeRight(ctx, e, touch) {
            if(!ctx[CONSTANTS.EVENT_SWIPE](e, touch)) return false;

            return touch.pageXDistance > 0 && Math.abs(touch.pageXDistance) > Math.abs(touch.pageYDistance);
        },
        isBottomReached(element) {
            return element.scrollHeight - element.scrollTop - element.clientHeight < 10;
        },
        isSupportScrollY(element) {
            let overflowY = document.defaultView.getComputedStyle(element).overflowY;

            return (overflowY === 'scroll' || overflowY === 'auto') && element.scrollTop > 0;
        }
    },
    Statics: {
        initEvents(el, binding, vnode) {
            let _self = this;

            if(_self.isInDomCaches(el)) return;

            let domCache = _self.getDomCache(el);

            domCache.listenTouchEvents.touchStartHandler = e => {
                if(_self.isPC() || _self.isPrimaryTouch(e)) return;
                _self.touchStartHandler(el, e);
            };
            domCache.listenTouchEvents.touchMoveHandler = e => {
                if(_self.isPC() || _self.isPrimaryTouch(e)) return;
                _self.touchMoveHandler(el, e);
            };
            domCache.listenTouchEvents.touchEndHandler = e => {
                if(_self.isPC() || _self.isPrimaryTouch(e)) return;
                _self.touchEndHandler(el, e);
            };
            domCache.listenTouchEvents.clickHandler = function(e) {
                _self.clickHandler(el, e);
            };

            el.addEventListener(CONSTANTS.EVENT_TOUCH_START, domCache.listenTouchEvents.touchStartHandler, false);
            el.addEventListener(CONSTANTS.EVENT_TOUCH_MOVE, domCache.listenTouchEvents.touchMoveHandler, false);
            el.addEventListener(CONSTANTS.EVENT_TOUCH_END, domCache.listenTouchEvents.touchEndHandler, false);
            el.addEventListener(CONSTANTS.EVENT_CLICK, domCache.listenTouchEvents.clickHandler, false);
        },
        invokeHandler(e, o, touch, gestureName) {
            logEngine.judgements[gestureName](e, touch, o) && this.executeFn(e, o);
        },

        clickHandler(self, e) {
            let _self = this;
            let domCache = _self.getDomCache(self);

            domCache.gestureEvents.click && _self.executeFn(e, o);
            _self.isPC() && logEngine.config.gestureEventsToClick.forEach(elem => {
                domCache.gestureEvents[elem] && _self.executeFn(e, domCache.gestureEvents[elem]);
            });
        },
        touchStartHandler(el, e) {
            let _self = this;
            let domCache = _self.getDomCache(el);
            let touch = domCache.touch;
            let o = domCache.gestureEvents[CONSTANTS.EVENT_TOUCH_START];

            o && _self.executeFn(e, o);
            touch.touchStartTime = e.timeStamp;
            touch.touchStartCoordination.pageX = e.touches[0].pageX;
            touch.touchStartCoordination.pageY = e.touches[0].pageY;
        },
        touchMoveHandler(el, e) {
            let domCache = this.getDomCache(el);

            domCache.gestureEvents[CONSTANTS.EVENT_TOUCH_MOVE] && this.executeFn(e, o);
        },
        touchEndHandler(el, e) {
            let _self = this;
            let domCache = _self.getDomCache(el);
            let touch = domCache.touch;

            touch.touchEndTime = e.timeStamp;
            touch.touchEndCoordination.pageX = e.changedTouches[0].pageX;
            touch.touchEndCoordination.pageY = e.changedTouches[0].pageY;

            for (let eventName in domCache.gestureEvents) {
                _self.invokeHandler(e, domCache.gestureEvents[eventName], touch, eventName);
            }
            touch.lastTouchStartTime = touch.touchStartTime;
            touch.lastTouchEndTime = touch.touchEndTime;
            touch.lastTouchStartCoordination = { ...touch.touchStartCoordination };
            touch.lastTouchEndCoordination = { ...touch.touchEndCoordination };
        },
        getDomCache (el) {
            return logEngine.domCaches[el[logEngine.global.InternalKeyName]] ||
              (logEngine.domCaches[el[logEngine.global.InternalKeyName] = logEngine.global.domUuid++] = this.initDomCache());
        },
        isInDomCaches (el) {
            return !!logEngine.domCaches[el[logEngine.global.InternalKeyName]];
        },
        unbindDirective(el) {
            this.removeDirectiveEventListeners(el, this.getDomCache(el));
            logEngine.domCaches[el[logEngine.global.InternalKeyName]] = null;
            delete logEngine.domCaches[el[logEngine.global.InternalKeyName]];
        },
        initDomCache() {
            return {
                touch: {
                    touchStartTime: 0,
                    touchEndTime: 0,
                    touchStartCoordination: {},
                    touchEndCoordination: {},

                    lastTouchEndTime: 0,
                    lastTouchStartTime: 0,
                    lastTouchStartCoordination: {},
                    lastTouchEndCoordination: {},

                    get timeInterval () {
                        return this.touchEndTime - this.touchStartTime;
                    },
                    get pageXDistance () {
                        return this.touchEndCoordination.pageX - this.touchStartCoordination.pageX;
                    },
                    get pageYDistance () {
                        return this.touchEndCoordination.pageY - this.touchStartCoordination.pageY;
                    },
                    get lastTimeInterval () {
                        return this.lastTouchEndTime - this.lastTouchStartTime;
                    },
                    get lastPageXDistance () {
                        return this.lastTouchEndCoordination.pageX - this.lastTouchStartCoordination.pageX;
                    },
                    get lastPageYDistance () {
                        return this.lastTouchEndCoordination.pageY - this.lastTouchStartCoordination.pageY;
                    },
                    get deltaTime () {
                        return this.touchEndTime - this.lastTouchStartTime;
                    },
                },
                gestureEvents: {},
                listenTouchEvents: {},
            };
        },
        getEventNameByArg(arg) {
            let str = (arg.indexOf(':') === 0 ? arg.substr(1) : arg).toLocaleLowerCase();

            return (typeof logEngine.judgements[str] !== 'function') ? false : str;
        },
        /**
         * ensure swiping with one touch and not pinching
         * @param event
         * @returns {boolean|*}
         */
        isPrimaryTouch(event) {
            return (event.touches.length > 1 || event.scale && event.scale !== 1);
        },
        isPC() {
            let uaInfo = navigator.userAgent;
            let agents = ['Android', 'iPhone', 'Windows Phone', 'iPad', 'iPod'];
            let flag = true;

            for (let i = 0; i < agents.length; i++) {
                if(uaInfo.indexOf(agents[i]) > 0) { flag = false; break; }
            }

            return flag;
        },
        removeDirectiveEventListeners(el, domCache) {
            el.removeEventListener(CONSTANTS.EVENT_TOUCH_START, domCache.listenTouchEvents.touchStartHandler);
            el.removeEventListener(CONSTANTS.EVENT_TOUCH_MOVE, domCache.listenTouchEvents.touchMoveHandler);
            el.removeEventListener(CONSTANTS.EVENT_TOUCH_END, domCache.listenTouchEvents.touchEndHandler);
            el.removeEventListener(CONSTANTS.EVENT_CLICK, domCache.listenTouchEvents.clickHandler);
        },
        executeFn(e, o) {
            let logKey = 'log-key' in o.el.attributes ? o.el.attributes['log-key'].nodeValue : o.data;

            if(logKey == 0) return;
            let logData = 'log-data' in o.el.attributes ? JSON.parse(o.el.attributes['log-data'].nodeValue) : null;

            logEngine.config.eventHandler && logEngine.config.eventHandler(logKey, logData);
            o.modifiers.start && e.stopPropagation();
            o.modifiers['default'] && e.preventDefault();
        }
    },
    judgements: {
        [CONSTANTS.EVENT_TAP](e, touch, o) {
            return (touch.timeInterval < logEngine.config.maxSingleTapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < logEngine.config.maxSingleTapPageDistanceSquared;
        },
        [CONSTANTS.EVENT_LONG_TAP](e, touch, o) {
            return (touch.timeInterval > logEngine.config.minLongTapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < logEngine.config.maxSingleTapPageDistanceSquared;
        },
        [CONSTANTS.EVENT_DOUBLE_TAP](e, touch, o) {
            return touch.deltaTime < logEngine.config.maxDoubleTapTimeInterval &&
              (touch.lastPageXDistance * touch.lastPageXDistance + touch.pageYDistance * touch.pageYDistance) < logEngine.config.maxDoubleTapPageDistanceSquared &&
              (touch.timeInterval < logEngine.config.maxSingleTapTimeInterval) && (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) < logEngine.config.maxSingleTapPageDistanceSquared &&
              (touch.lastTimeInterval < logEngine.config.maxSingleTapTimeInterval) && (touch.lastPageXDistance * touch.lastPageXDistance + touch.lastPageYDistance * touch.lastPageYDistance) < logEngine.config.maxSingleTapPageDistanceSquared;
        },
        [CONSTANTS.EVENT_SWIPE](e, touch, o) {
            return (touch.pageXDistance * touch.pageXDistance + touch.pageYDistance * touch.pageYDistance) > logEngine.config.maxSingleTapPageDistanceSquared;
        },
        [CONSTANTS.EVENT_SWIPE_LEFT](e, touch, o) {
            return logEngine.util.checkSwipeLeft(this, e, touch);
        },
        [CONSTANTS.EVENT_SWIPE_RIGHT](e, touch, o) {
            return logEngine.util.checkSwipeRight(this, e, touch);
        },
        [CONSTANTS.EVENT_SWIPE_UP](e, touch, o) {
            return logEngine.util.checkSwipeUp(this, e, touch);
        },
        [CONSTANTS.EVENT_SWIPE_DOWN](e, touch, o) {
            return logEngine.util.checkSwipeDown(this, e, touch);
        },
        [CONSTANTS.EVENT_SWIPE_BOTTOM](e, touch, o) {
            if(!logEngine.util.checkSwipeUp(this, e, touch)) {
                return false;
            }
            if(!logEngine.util.isSupportScrollY(o.el)) {
                return false;
            }

            return logEngine.util.isBottomReached(o.el);
        },
        [CONSTANTS.EVENT_TOUCH_START]() { return false; },
        [CONSTANTS.EVENT_TOUCH_MOVE]() { return false; },
        [CONSTANTS.EVENT_TOUCH_END]() { return true; },
        [CONSTANTS.EVENT_CLICK]() { return false; },
    }
};

export default {
    acceptStatement: true,

    bind (el, binding, vnode) {
        logEngine.Statics.initEvents(el, binding, vnode);
        let eventName = logEngine.Statics.getEventNameByArg(binding.arg);
        
        if(!eventName) {
            console.error('self.arg not correct argument;');
            return;
        }
        logEngine.Statics.getDomCache(el).gestureEvents[eventName] = {
            el,
            data: binding.expression,
            modifiers: binding.modifiers
        };
    },
    update (el, binding, vnode) {},

    unbind (el, binding, vnode) {
        logEngine.Statics.unbindDirective(el);
    }
}

import { Browser } from "././Browser";
import { Utils } from "././Utils";
var supportWeakMap = !!WeakMap;
/**
     * 封装弱引用WeakMap
     * 如果支持WeakMap，则使用WeakMap，如果不支持，则用Object代替
     * 注意：如果采用Object，为了防止内存泄漏，则采用定时清理缓存策略
     */
export class WeakObject {
    constructor() {
        this._obj = WeakObject.supportWeakMap ? new Browser.window.WeakMap() : {};
        if (!WeakObject.supportWeakMap)
            WeakObject._maps.push(this);
    }
    /**@private */
    static __init__() {
        //WeakObject.supportWeakMap = Browser.window.WeakMap != null;
        //如果不支持，10分钟回收一次
        if (!WeakObject.supportWeakMap)
            window.Laya.systemTimer.loop(WeakObject.delInterval, null, WeakObject.clearCache);
    }
    /**清理缓存，回收内存*/
    //TODO:coverage
    static clearCache() {
        for (var i = 0, n = WeakObject._maps.length; i < n; i++) {
            var obj = WeakObject._maps[i];
            obj._obj = {};
        }
    }
    /**
     * 设置缓存
     * @param	key kye对象，可被回收
     * @param	value object对象，可被回收
     */
    set(key, value) {
        if (key == null)
            return;
        if (WeakObject.supportWeakMap) {
            var objKey = key;
            if (typeof (key) == 'string' || typeof (key) == 'number') {
                objKey = WeakObject._keys[key];
                if (!objKey)
                    objKey = WeakObject._keys[key] = { k: key };
            }
            this._obj.set(objKey, value);
        }
        else {
            if (typeof (key) == 'string' || typeof (key) == 'number') {
                this._obj[key] = value;
            }
            else {
                key.$_GID || (key.$_GID = Utils.getGID());
                this._obj[key.$_GID] = value;
            }
        }
    }
    /**
     * 获取缓存
     * @param	key kye对象，可被回收
     */
    get(key) {
        if (key == null)
            return null;
        if (WeakObject.supportWeakMap) {
            var objKey = (typeof (key) == 'string' || typeof (key) == 'number') ? WeakObject._keys[key] : key;
            if (!objKey)
                return null;
            return this._obj.get(objKey);
        }
        else {
            if (typeof (key) == 'string' || typeof (key) == 'number')
                return this._obj[key];
            return this._obj[key.$_GID];
        }
    }
    /**
     * 删除缓存
     */
    //TODO:coverage
    del(key) {
        if (key == null)
            return;
        if (WeakObject.supportWeakMap) {
            var objKey = (typeof (key) == 'string' || typeof (key) == 'number') ? WeakObject._keys[key] : key;
            if (!objKey)
                return;
            this._obj.delete(objKey);
        }
        else {
            if (typeof (key) == 'string' || typeof (key) == 'number')
                delete this._obj[key];
            else
                delete this._obj[this._obj.$_GID];
        }
    }
    /**
     * 是否有缓存
     */
    //TODO:coverage
    has(key) {
        if (key == null)
            return false;
        if (WeakObject.supportWeakMap) {
            var objKey = (typeof (key) == 'string' || typeof (key) == 'number') ? WeakObject._keys[key] : key;
            return this._obj.has(objKey);
        }
        else {
            if (typeof (key) == 'string' || typeof (key) == 'number')
                return this._obj[key] != null;
            return this._obj[this._obj.$_GID] != null;
        }
    }
}
/**是否支持WeakMap*/
WeakObject.supportWeakMap = supportWeakMap;
/**如果不支持WeakMap，则多少时间清理一次缓存，默认10分钟清理一次*/
WeakObject.delInterval = 10 * 60 * 1000;
/**全局WeakObject单例*/
WeakObject.I = new WeakObject();
/**@private */
WeakObject._keys = {};
/**@private */
WeakObject._maps = [];
//WeakObject.__init__();
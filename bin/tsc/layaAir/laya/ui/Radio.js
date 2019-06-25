import { Event } from "../events/Event";
import { Button } from "./Button";
import { ILaya } from "../../ILaya";
/**
 * <code>Radio</code> 控件使用户可在一组互相排斥的选择中做出一种选择。
 * 用户一次只能选择 <code>Radio</code> 组中的一个成员。选择未选中的组成员将取消选择该组中当前所选的 <code>Radio</code> 控件。
 * @see laya.ui.RadioGroup
 */
export class Radio extends Button {
    /**
     * 创建一个新的 <code>Radio</code> 类实例。
     * @param skin 皮肤。
     * @param label 标签。
     */
    constructor(skin = null, label = "") {
        super(skin, label);
        // preinitialize 放到这里了，因为不知道什么时候调用
        this.toggle = false;
        this._autoSize = false;
    }
    /**@inheritDoc */
    /*override*/ destroy(destroyChild = true) {
        super.destroy(destroyChild);
        this._value = null;
    }
    /**@inheritDoc */
    /*override*/ preinitialize() {
        super.preinitialize();
        this.toggle = false;
        this._autoSize = false;
    }
    /**@inheritDoc */
    /*override*/ initialize() {
        super.initialize();
        this.createText();
        this._text.align = "left";
        this._text.valign = "top";
        this._text.width = 0;
        this.on(Event.CLICK, this, this.onClick);
    }
    /**
     * @private
     * 对象的<code>Event.CLICK</code>事件侦听处理函数。
     */
    onClick(e) {
        this.selected = true;
    }
    /**
     * 获取或设置 <code>Radio</code> 关联的可选用户定义值。
     */
    get value() {
        return this._value != null ? this._value : this.label;
    }
    set value(obj) {
        this._value = obj;
    }
}
ILaya.regClass(Radio);
// main logic for our editor by constructtor

// in array http://stackoverflow.com/questions/784012/javascript-equivalent-of-phps-in-array
function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

// extend function without jquery https://gist.github.com/cfv1984/6319681685f78333d98a
var extend = function () {

    function isFunction(fn) {
        return typeof(fn) === "function" && fn.constructor === Function
    }

    function isArray(ar) {
        return ar instanceof Array
    }

    function isPlainObject(obj) {
        return typeof obj == 'object' && obj.constructor == Object
    }

    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    if (typeof target !== "object" && !isFunction(target)) target = {};
    if (i === length) {
        target = this;
        i--;
    }
    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) continue;

                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                    if (!copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    }
                    else clone = src && isPlainObject(src) ? src : {};

                    target[name] = extend(deep, clone, copy);
                }
                else if (copy !== undefined) target[name] = copy;
            }
        }
    }

    return target;
};

// initial fabric
let fabric = require('fabric').fabric;


// Additional functions for review tool

function setLineControls(line) {
    line.setControlVisible("tr", false);
    line.setControlVisible("tl", false);
    line.setControlVisible("br", false);
    line.setControlVisible("bl", false);
    line.setControlVisible("ml", false);
    line.setControlVisible("mr", false);
}

function createArrowHead(points) {
    let headLength = 15,
        x1 = points[0],
        y1 = points[1],
        x2 = points[2],
        y2 = points[3],

        dx = x2 - x1,
        dy = y2 - y1,

        angle = Math.atan2(dy, dx);

    angle *= 180 / Math.PI;
    angle += 90;

    let triangle = new fabric.Triangle({
        angle: angle,
        fill: 'red',
        top: y2,
        left: x2,
        height: headLength,
        width: headLength,
        originX: 'center',
        originY: 'center'
    });

    return triangle;
}

function createLine(points) {
    let line = new fabric.Line(points,
        {
            strokeWidth: 3,
            stroke: 'red',
            originX: 'center',
            originY: 'center',
            lockScalingX: true
        });
    setLineControls(line);
    return line;
}
// end

fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#000',
    cornerColor: '#000'
});

// make editor
export default class Editor {
    constructor(canvas, width, height) {
        this.canvas_id = canvas;
        this.width = width;
        this.height = height;
        //initial object of fabric
        this.canv = new fabric.Canvas(this.canvas_id,
            {
                width: this.width,
                height: this.height
            });
    }

    //sets background
    setBackground(imgsrc) {
        var sX = 1;
        var sY = 1;
        let cdim = [this.canv.width, this.canv.height];
        let c = this.canv;
        fabric.Image.fromURL(imgsrc, function (img) {
            let originalsize = img.getOriginalSize();
            if (originalsize.width > cdim[0]) {
                sX = cdim[0] / originalsize.width+ 0.005;
                sY = sX;
            }
            let center = c.getCenter();
            c.setBackgroundImage(imgsrc, c.renderAll.bind(c), {
                scaleY: sY,
                scaleX: sX,
                top: center.top,
                left: center.left,
                originX: 'center',
                originY: 'center'
            });
        });
    }

    setFont(family, size, color, texts, backgroundColor = 'transparent', opacity = 1) {
        let obj = new fabric.IText(
            texts,
            {
                fontFamily: family,
                left: 500,
                top: 100,
                fontSize: size,
                fill: color,
                backgroundColor: backgroundColor
            }).setOpacity(opacity);
        this.canv.add(obj);
        this.canv.renderAll();
    }

    setPrice(family, size, color, texts) {
        let obj = new fabric.IText(
            texts,
            {
                fontFamily: family,
                left: 500,
                top: 100,
                fontSize: size,
                fill: color,
                styles: {
                    0: {
                        0: {fontSize: size * 0.7},
                        1: {fontSize: size * 0.7},
                        3: {fontSize: size * 1.3},

                        5: {fontSize: size * 1.3},
                        6: {fontSize: size * 1.3},
                        7: {fontSize: size * 1.3},

                        9: {fontSize: size},
                        10: {fontSize: size},
                        11: {fontSize: size}
                    }
                }
            });
        this.canv.add(obj);
        this.canv.renderAll();
    }

    addImage(imgForAdd) {
        fabric.Image.fromURL(imgForAdd, (img) => {
            this.canv.add(img);
        });
    }

    addButton(w = 220, h = 80, fontFamily = 'Roboto', fontSize = 20, fontText = 'Смотреть >') {
        let border = new fabric.Rect({
            width: w,
            height: h,
            fill: 'transparent',
            stroke: '#000',
            strokeWidth: 2,
            rx: 5,
            ry: 5
        });
        let texting = new fabric.IText(fontText, {
            fontFamily: fontFamily,
            fontSize: fontSize,
            top: h / 4,
            left: w / 4.4
        });
        texting.setTop(h / 2 - texting.getHeight() / 2);
        texting.setLeft(w / 2 - texting.getWidth() / 2);
        let group = new fabric.Group([border, texting], {
            left: 200,
            top: 100
        });
        this.canv.add(group);
    }

    //working now
    downloadImage(link, obj, groups) {
        disableControls(obj, groups);

        link.href = this.canv.toDataURL({
                format: 'png',
                quality: 1.0
            }
        );
        link.download = 'result.png';
    }

    deleteObject(obj, group) {
        let canvaser = this.canv;
        if (obj) {
            canvaser.remove(obj);
        }
        else if (group) {
            const objectsInGroup = group.getObjects();
            canvaser.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                canvaser.remove(object);
            });
        }

    }

    addArrow() {
        let pts = [100, 200, 100, 100];
        let triangle = createArrowHead(pts);
        let line = createLine(pts);
        let grp = new fabric.Group([triangle, line]);
        setLineControls(grp);
        this.canv.add(grp);
    }

    addDot() {
        let circle = new fabric.Circle({
            radius: 6,
            fill: 'black',
            stroke: '#ff9900',
            strokeWidth: 3,
            left: 490,
            top: 90
        });
        this.canv.add(circle);
        this.canv.renderAll();
    }

    addRectangle() {
        this.canv.add(new fabric.Rect({
            width: 200,
            height: 100,
            left: 100,
            top: 100,
            stroke: 'red',
            fill: 'transparent'
        }))
    }

    addEllipse() {
        this.canv.add(new fabric.Circle({
            radius: 100,
            left: 100,
            top: 100,
            stroke: 'red',
            fill: 'transparent',
            scaleY: 0.5
        }))
    }

    setTextInItext(texter) {
        let act = this.canv.getActiveObject();
        if (act) {
            let objs = act.getObjects();
            for (let i = 0; i < objs.length; i++) {
                if (objs[i].text) {
                    if (texter.length < 1) {
                        texter = ' ';
                    }
                    objs[i].setText(texter);
                }
                else if (objs[i].type === 'rect') {
                    objs[i].setWidth(texter.length * 11);
                }
            }
            this.canv.renderAll();
        }
    }
}


export function disableControls(obj, groups) {
    if (obj) {
        obj.hasControls = obj.hasBorders = false;
    }
    else if (groups) {
        let items = groups.getObjects();
        groups.hasControls = groups.hasBorders = false;
        for (var i = 0; i < items.length; i++) {
            items[i].hasControls = items[i].hasBorders = false;
        }
    }
}

// main logic for our editor by constructtor

// in array http://stackoverflow.com/questions/784012/javascript-equivalent-of-phps-in-array
function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

// converter pt to px
function ptToPx(points) {
    return Math.round(points * 1.333333)
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
        let c = this.canv;
        fabric.Image.fromURL(imgsrc, function (img) {
            (function getCanvasAtResoution(newWidth, newHeight) {
                let can = c;
                if (can.width != newWidth || can.height != newHeight) {
                    can.setWidth(newWidth);
                    can.setHeight(newHeight);
                    can.renderAll();
                    can.calcOffset();
                }
            })(img.width, img.height);
            c.setBackgroundImage(imgsrc, c.renderAll.bind(c), {});
        });
    }


    setFont(family, size, color, texts, backgroundColor = 'transparent', opacity = 1) {
        let obj = new fabric.IText(
            texts,
            {
                fontFamily: family,
                left: this.canv.getWidth() / 2 * this.seekAndResize(),
                top: this.canv.getHeight() / 4 * this.seekAndResize(),
                fontSize: ptToPx(size) * this.seekAndResize(),
                fill: color,
                backgroundColor: backgroundColor,
                lockScalingX: true,
                lockScalingY: true
            }).setOpacity(opacity);
        this.canv.add(obj);
        this.canv.renderAll();
    }

    setPrice(family, size, color, texts) {
        let obj = new fabric.IText(
            texts,
            {
                fontFamily: family,
                left: 500 * this.seekAndResize(),
                top: 100 * this.seekAndResize(),
                fontSize: ptToPx(size) * this.seekAndResize(),
                fill: color,
                lockScalingX: true,
                lockScalingY: true,
                styles: {
                    0: {
                        0: {fontSize: ptToPx(13)},
                        1: {fontSize: ptToPx(13)},

                        9: {fontSize: ptToPx(13)},
                        10: {fontSize: ptToPx(13)},
                        11: {fontSize: ptToPx(13)}
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

    addButton(url, w = 120, h = 30, fontFamily = 'Roboto', fontSize = 13, fontText = 'Смотреть', textColor = '#3c3c3c') {

        if (url) {
            this.addImage(url)
        }
        else {
            let border = new fabric.Rect({
                width: w * this.seekAndResize(),
                height: h * this.seekAndResize(),
                fill: 'transparent',
                stroke: '#3c3c3c',
                strokeWidth: 1,
                rx: 5,
                ry: 5
            });
            let texting = new fabric.IText(fontText, {
                fontFamily: fontFamily,
                fontSize: fontSize * this.seekAndResize(),
                fill: textColor,
                top: h / 4,
                left: w / 4.4
            });
            texting.setTop(border.height / 2 - texting.getHeight() / 2);
            texting.setLeft(border.width / 2 - texting.getWidth() / 2);
            let group = new fabric.Group([border, texting], {
                left: 200 * this.seekAndResize(),
                top: 100 * this.seekAndResize()
            });
            this.canv.add(group);
        }
    }

    // downloads an image
    downloadImage(link, obj, groups) {
        let canvas = this.canv;
        let objs = canvas.getObjects();
        this.filterAndDelete(objs);
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

    // change grid size
    setNewGridSize(gridSize = 10) {
        // create grid
        let canvas = this.canv;
        let objs = canvas.getObjects();
        let typesObj = objs.map(function (a) {
            return a.type;
        });
        if (inArray('line', typesObj)) {
            this.filterAndDelete(objs);
            this.addGrid(gridSize);
        }
        else {
            this.addGrid(gridSize)
        }
    }

    // add grid for canvas
    setGridToCanv(gridSize = 10) {
        // create grid
        let canvas = this.canv;
        let objs = canvas.getObjects();
        let typesObj = objs.map(function (a) {
            return a.type;
        });
        if (inArray('line', typesObj)) {
            this.filterAndDelete(objs);
        }
        else {
            this.addGrid(gridSize)
        }
    }

    // util func for adding  grid to canvas
    addGrid(gridSize = 15) {
        let canvas = this.canv;
        for (let i = 0; i < (canvas.width / gridSize); i++) {
            canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
                stroke: '#A1A1A1',
                selectable: false
            }));
        }
        for (let i = 0; i < (canvas.height / gridSize); i++) {
            canvas.add(new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], {
                stroke: '#A1A1A1',
                selectable: false
            }))
        }
        canvas.on('object:moving', function (options) {
            options.target.set({
                left: Math.round(options.target.left / gridSize) * gridSize,
                top: Math.round(options.target.top / gridSize) * gridSize
            });
        });
    }

    // filters array for line type
    filterAndDelete(objs) {
        let canvas = this.canv;
        var toDeleteObjs = objs.filter(function (a) {
            return a.type === 'line'
        });
        toDeleteObjs.forEach(function (object) {
            canvas.remove(object);
        });
    }

    // resize calc for buttons and texts
    seekAndResize() {
        const defwidth = 960;
        const defheight = 420;
        let realWidth = this.canv.getWidth();
        let realHeight = this.canv.getHeight();
        let coef = 0;
        if (realHeight > realWidth) {
            if (realHeight > defheight) {
                coef = realHeight / defheight
            }
            else {
                coef = 1
            }
        }
        else {
            if (realWidth > defwidth) {
                coef = realWidth / defwidth
            }
            else {
                coef = 1
            }
        }
        return coef
    }

    setColorToObjects(obj, objects, col) {
        let canvas = this.canv;
        if (obj) {
            obj.setColor(col)
        }
        else if (objects) {
            const objectsInGroup = objects.getObjects();
            // canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                object.setColor(col)
            });
        }
        canvas.renderAll();
    }

    setAdaptiveGrid() {
        let canvas = this.canv;
        let currentCursor = 0;
        let padding = {
            'sides': 52,
            'top': 30,
            'bottom': 20
        };
        let productSize = {
            'width': 285,
            'height': 200
        };
        console.log(padding, productSize);
        for (let i = 0; i < 3; i++) {
            canvas.add(new fabric.Line([padding.sides, padding.top * (i + 1), canvas.getWidth() - padding.sides, padding.top * (i + 1)], {
                stroke: '#ff6600',
                selectable: false,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true
            }));
            currentCursor = (i + 1) * padding.top;
        }
        for (let i = 0; i < 4; i++) {
            canvas.add(new fabric.Line([padding.sides + (i * productSize.width), currentCursor, padding.sides + (i * productSize.width), currentCursor + productSize.height], {
                stroke: '#ff6600',
                selectable: false,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true
            }));
        }
        currentCursor += productSize.height;
        console.log(currentCursor);
        let tempPadding = 20;
        for (let i = 0; i < 5; i++) {
            canvas.add(new fabric.Line([padding.sides, currentCursor, canvas.getWidth() - padding.sides, currentCursor], {
                stroke: '#ff6600',
                selectable: false,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true
            }));
            if (i % 2 === 0) {
                tempPadding = 20
            }
            else {
                tempPadding = 40
            }
            currentCursor += tempPadding
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

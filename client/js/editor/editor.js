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

// this is used to align buttons by bottom. When we add new button - dynamic left coord changes
let leftCoords = 0;
// padding between buttons
let padding_buttons = 65;


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
        let center = this.canv.getCenter();
        this.canv.setBackgroundImage(imgsrc, this.canv.renderAll.bind(this.canv), {
            scaleX: 1,
            scaleY: 1,
            top: center.top,
            left: center.left,
            originX: 'center',
            originY: 'center'
        });
    }

    setFont(family, size, color, texts) {
        let obj = new fabric.IText(
            texts,
            {
                fontFamily: family,
                left: 500,
                top: 100,
                fontSize: size,
                fill: color
            });
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

    addButton() {
        let group = new fabric.Group([], {
            top: 60,
            left: 250
        });
        group.add(new fabric.Rect({
            width: 220,
            height: 45,
            fill: 'transparent',
            stroke: '#000',
            strokeWidth: 2,
            rx: 5,
            ry: 5
        }));
        group.add(new fabric.IText('Смотреть   >', {
            width: group.get('width'),
            height: group.get('height'),
            fontFamily: 'Roboto',
            fontSize: 20,
            top: 10,
            left: 70,
            // top: -group.get('height') + 10,
            // left: -group.get('width') + 48,
            originX: 'left',
            originY: 'top'
        }));
        this.canv.add(group);
        this.canv.renderAll();
        let items = group.getObjects();
        this.canv.remove(group);
        for (var i = 0; i < items.length; i++) {
            this.canv.add(items[i]);
        }
        this.canv.renderAll();
    }

    //working now
    downloadImage(link) {
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
            if (this.canv.getActiveObject().get('type') === 'Tag') {
                leftCoords = 0;
            }
            canvaser.remove(obj);
        }
        else if (group) {
            let del_types = [];
            const objectsInGroup = group.getObjects();
            canvaser.discardActiveGroup();
            for (var i = 0; i < objectsInGroup.length; i++) {
                del_types.push(objectsInGroup[i].get('type'));
            }
            if (inArray('Tag', del_types)) {
                leftCoords = 0;
            }
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

    addRectangle() {
        this.canv.add(new fabric.Rect({
            width: 100,
            height: 200,
            stroke: 'red',
            fill: undefined
        }))
    }

    addEllipse() {
        this.canv.add(new fabric.Circle({
            radius: 100,
            stroke: 'red',
            fill: undefined,
            scaleY: 0.5,
        }))
    }

    addCommentCloud(textInCloud) {
        let canvaser = this.canv;
        var id = 0, MoveAll = false;

        var block = new fabric.Rect({
            left: 50,
            top: 50,
            width: 50,
            height: 50,
            fill: 'white',
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            lockScalingX: false,
            lockScalingY: false,
            lockRotation: false,
            hasControls: true,
            cornerSize: 8,
            hasBorders: true,
            strokeWidth: 1,
            stroke: '#E2E1E1',
            strokeLineJoin: 'round',
            padding: 0,
            id: 'block',
            name: 'subject'
        });

        var text = addTextToRect(block);
        block.width = text.width + 10;

        var group = new fabric.Group([block, text], {id: 'bubbleGroup', name: 'subject'});
        canvaser.add(group);
        console.log('bubble group: ' + JSON.stringify(group));

        var rect = makeRect(100, 200, 5, 5, this.canv);
        canvaser.add(rect);

        var p1 = {x: group.getCenterPoint().x - 10, y: group.getCenterPoint().y},
            p2 = {x: group.getCenterPoint().x + 10, y: group.getCenterPoint().y},
            p3 = {x: rect.getCenterPoint().x, y: rect.getCenterPoint().y};
        var shape = makePolygon(p1, p2, p3);
        canvaser.add(shape);
        shape.sendToBack();

        group.shape = shape;
        group.rect = rect;

        canvaser.renderAll();

        canvaser.on('object:moving', function (e) {
            var p = e.target;
            console.log('target type: ' + p.type + ' :::: status: ' + p.status + ' || ' + p.get('status'));

            if (p.type === 'group' && p.status !== 'moving') {
                canvaser.remove(p.shape);

                var p1 = {x: p.getCenterPoint().x - 10, y: p.getCenterPoint().y},
                    p2 = {x: p.getCenterPoint().x + 10, y: p.getCenterPoint().y},
                    p3 = {x: p.rect.getCenterPoint().x, y: p.rect.getCenterPoint().y};

                var shape = makePolygon(p1, p2, p3);

                canvaser.add(shape);
                canvaser.sendToBack(shape);
                p.shape = shape;
            } else if (p.type === 'rect') {
                var group = canvaser.item(id - 1);
               canvaser.remove(group.shape);

                var p1 = {x: group.getCenterPoint().x - 10, y: group.getCenterPoint().y},
                    p2 = {x: group.getCenterPoint().x + 10, y: group.getCenterPoint().y},
                    p3 = {x: p.getCenterPoint().x, y: p.getCenterPoint().y};

                var shape = makePolygon(p1, p2, p3);

                canvaser.add(shape);
                canvaser.sendToBack(shape);
                group.shape = shape;
            }

            canvaser.renderAll();
        });

        canvaser.on({
            'object:selected': selectedObject,
            'object:modified': deselectObject
        });

        function deselectObject(e) {
            console.log('type on deselect: ' + e.target.type);
        }

        function selectedObject(e) {
            id = canvaser.getObjects().indexOf(e.target);
            console.log('id: ' + id + ' type: ' + e.target.type);
            console.log('selectedObject: ' + JSON.stringify(e.target.toJSON()));
            console.log(e.target);//JSON.stringify(e.target));
        }

        function makePolygon(point1, point2, point3) {
            var shape = new fabric.Polygon([point1, point2, point3], {
                fill: '#E2E1E1',
                hasControls: false,
                lockRotation: true,
                selection: false,
                //selectable: false,
                padding: -1,
                perPixelTargetFind: true
            });

            shape.on('mousedown', function (evt) {
                //TODO: refactor this to only get objects for the balloon this polygon is associated with
                var objs = canvaser.getObjects();
                console.log('::: objs :::');
                console.log(objs);
                // var group = new fabric.Group(objs, {
                //   originX: 'center',
                //   originY: 'center'
                // });

                var group = new fabric.Group(objs, {status: 'moving'});

                // Relevant code
                var originalX = shape.left,
                    originalY = shape.top,
                    mouseX = evt.e.pageX,
                    mouseY = evt.e.pageY;
                canvaser.on('object:moving', function (evt) {
                    shape.left = originalX;
                    shape.top = originalY;
                    group.left += evt.e.pageX - mouseX;
                    group.top += evt.e.pageY - mouseY;
                    originalX = shape.left;
                    originalY = shape.top;
                    mouseX = evt.e.pageX;
                    mouseY = evt.e.pageY;
                });

                canvaser.setActiveGroup(group.setCoords()).renderAll();
            });

            // clean up the listener
            shape.on('mouseup', function (evt) {
                canvaser.off('object:moving');
            });
            return shape;
        }

        function makeRect(left, top, width, height, canvas) {
            var block = new fabric.Rect({
                left: left,
                top: top,
                width: width,
                height: height,
                // fill: 'rgb(127, 140, 141)',
                fill: 'black',
                originX: 'left',
                originY: 'top',
                centeredRotation: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                hasControls: false,
                cornerSize: 0,
                hasBorders: false,
                padding: 0
            });
            return block;
        }

        function addTextToRect(rect, text) {
            var rectText = new fabric.Text(textInCloud, {
                left: rect.left + 5, //Take the block's position
                top: rect.top + 10,
                fill: 'black',
                fontSize: 20,
                fontFamily: 'Arial',
                name: 'text1'
            });
            return rectText;
        }
    }
}
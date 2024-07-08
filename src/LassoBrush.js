// Modified source code for fabric.js PencilBrush class
//  - While drawing, render a filled selection
//  - Removed path smoothing (lineTo; drawing a polygon)
//  - Styled to look like box selection
//  - Final path not added to canvas at the end

import { fabric } from 'fabric'

export const LassoBrush = fabric.util.createClass(fabric.BaseBrush, {

    color: 'rgba(255, 255, 255, 0.3)',
    fillColor: 'rgba(100, 100, 255, 0.3)',

    /**
     * Discard points that are less than `decimate` pixel distant from each other
     * @type Number
     */
    decimate: 20,

    /**
     * Constructor
     * @param {fabric.Canvas} canvas
     * @return {fabric.PencilBrush} Instance of a pencil brush
     */
    initialize: function (canvas) {
        this.canvas = canvas;
        this._points = [];
    },

    _setBrushStyles: function (ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.width;
        ctx.lineCap = this.strokeLineCap;
        ctx.miterLimit = this.strokeMiterLimit;
        ctx.lineJoin = this.strokeLineJoin;
        ctx.setLineDash(this.strokeDashArray || []);
    },

    /**
     * Invoked inside on mouse down and mouse move
     * @param {Object} pointer
     */
    _drawSegment: function (ctx, p1, p2) {
        var midPoint = p1.midPointFrom(p2);
        ctx.lineTo(midPoint.x, midPoint.y);
        return midPoint;
    },
    /**
     * Invoked on mouse down
     * @param {Object} pointer
     */
    onMouseDown: function (pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
            return;
        }
        this._prepareForDrawing(pointer);
        // capture coordinates immediately
        // this allows to draw dots (when movement never occurs)
        this._captureDrawingPath(pointer);
        this._render();
    },
    /**
     * Invoked on mouse move
     * @param {Object} pointer
     */
    onMouseMove: function (pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
            return;
        }
        if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
            return;
        }
        if (this._captureDrawingPath(pointer) && this._points.length > 1) {
            // redraw curve
            // clear top canvas
            this.canvas.clearContext(this.canvas.contextTop);
            this._render();
        }
    },
    /**
     * Invoked on mouse up
     */
    onMouseUp: function (options) {
        if (!this.canvas._isMainEvent(options.e)) {
            return true;
        }
        this.oldEnd = undefined;
        this._finalizeAndAddPath();
        return false;
    },
    /**
     * @private
     * @param {Object} pointer Actual mouse position related to the canvas.
     */
    _prepareForDrawing: function (pointer) {
        var p = new fabric.Point(pointer.x, pointer.y);
        this._reset();
        this._addPoint(p);
        this.canvas.contextTop.moveTo(p.x, p.y);
    },
    /**
     * @private
     * @param {fabric.Point} point Point to be added to points array
     */
    _addPoint: function (point) {
        if (this._points.length > 1 && point.eq(this._points[this._points.length - 1])) {
            return false;
        }
        this._points.push(point);
        return true;
    },
    /**
     * Clear points array and set contextTop canvas style.
     * @private
     */
    _reset: function () {
        this._points = [];
        this._setBrushStyles(this.canvas.contextTop);
        this._setShadow();
    },
    /**
     * @private
     * @param {Object} pointer Actual mouse position related to the canvas.
     */
    _captureDrawingPath: function (pointer) {
        var pointerPoint = new fabric.Point(pointer.x, pointer.y);
        return this._addPoint(pointerPoint);
    },
    /**
     * Draw a smooth path on the topCanvas using quadraticCurveTo
     * @private
     * @param {CanvasRenderingContext2D} [ctx]
     */
    _render: function (ctx) {
        var i, len,
            p1 = this._points[0],
            p2 = this._points[1];
        ctx = ctx || this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.beginPath();
        //if we only have 2 points in the path and they are the same
        //it means that the user only clicked the canvas without moving the mouse
        //then we should be drawing a dot. A path isn't drawn between two identical dots
        //that's why we set them apart a bit
        if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
            var width = this.width / 1000;
            p1 = new fabric.Point(p1.x, p1.y);
            p2 = new fabric.Point(p2.x, p2.y);
            p1.x -= width;
            p2.x += width;
        }
        ctx.moveTo(p1.x, p1.y);
        for (i = 1, len = this._points.length; i < len; i++) {
            // we pick the point between pi + 1 & pi + 2 as the
            // end point and p1 as our control point.
            this._drawSegment(ctx, p1, p2);
            p1 = this._points[i];
            p2 = this._points[i + 1];
        }
        // Draw last line as a straight line while
        // we wait for the next point to be able to calculate
        // the bezier control point
        ctx.lineTo(p1.x, p1.y);
        ctx.fill();
        ctx.restore();
    },
    /**
     * Converts points to SVG path
     * @param {Array} points Array of points
     * @return {(string|number)[][]} SVG path commands
     */
    convertPointsToSVGPath: function (points) {
        var correction = this.width / 1000;

        var path = [], i,
            p1 = new fabric.Point(points[0].x, points[0].y),
            p2 = new fabric.Point(points[1].x, points[1].y),
            len = points.length, multSignX = 1, multSignY = 0, manyPoints = len > 2;
        correction = correction || 0;
        if (manyPoints) {
            multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
            multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
        }
        path.push(['M', p1.x - multSignX * correction, p1.y - multSignY * correction]);
        for (i = 1; i < len; i++) {
            if (!p1.eq(p2)) {
                var midPoint = p1.midPointFrom(p2);
                // midpoint is our endpoint
                // start point is p(i-1) value.
                path.push(['L', midPoint.x, midPoint.y]);
            }
            p1 = points[i];
            if ((i + 1) < points.length) {
                p2 = points[i + 1];
            }
        }
        if (manyPoints) {
            multSignX = p1.x > points[i - 2].x ? 1 : p1.x === points[i - 2].x ? 0 : -1;
            multSignY = p1.y > points[i - 2].y ? 1 : p1.y === points[i - 2].y ? 0 : -1;
        }
        path.push(['L', p1.x + multSignX * correction, p1.y + multSignY * correction]);
        return path;
    },
    /**
     * @private
     * @param {(string|number)[][]} pathData SVG path commands
     * @returns {boolean}
     */
    _isEmptySVGPath: function (pathData) {
        var pathString = fabric.util.joinPath(pathData);
        return pathString === 'M 0 0 L 0 0 L 0 0'; // I don't know what this is
    },
    /**
     * Creates fabric.Path object to add on canvas
     * @param {(string|number)[][]} pathData Path data
     * @return {fabric.Path} Path to add on canvas
     */
    createPath: function (pathData) {
        var path = new fabric.Path(pathData, {
            fill: this.fillColor,
            stroke: this.color,
            strokeWidth: this.width,
            strokeLineCap: this.strokeLineCap,
            strokeMiterLimit: this.strokeMiterLimit,
            strokeLineJoin: this.strokeLineJoin,
            strokeDashArray: this.strokeDashArray,
        });
        if (this.shadow) {
            this.shadow.affectStroke = true;
            path.shadow = new fabric.Shadow(this.shadow);
        }
        return path;
    },
    /**
     * Decimate points array with the decimate value
     */
    decimatePoints: function (points, distance) {
        if (points.length <= 2) {
            return points;
        }
        var zoom = this.canvas.getZoom(), adjustedDistance = Math.pow(distance / zoom, 2),
            i, l = points.length - 1, lastPoint = points[0], newPoints = [lastPoint],
            cDistance;
        for (i = 1; i < l - 1; i++) {
            cDistance = Math.pow(lastPoint.x - points[i].x, 2) + Math.pow(lastPoint.y - points[i].y, 2);
            if (cDistance >= adjustedDistance) {
                lastPoint = points[i];
                newPoints.push(lastPoint);
            }
        }
        /**
         * Add the last point from the original line to the end of the array.
         * This ensures decimate doesn't delete the last point on the line, and ensures the line is > 1 point.
         */
        newPoints.push(points[l]);
        return newPoints;
    },
    /**
     * On mouseup after drawing the path on contextTop canvas
     * we use the points captured to create an new fabric path object
     * and add it to the fabric canvas.
     */
    _finalizeAndAddPath: function () {
        var ctx = this.canvas.contextTop;
        ctx.closePath();
        if (this.decimate) {
            this._points = this.decimatePoints(this._points, this.decimate);
        }
        var pathData = this.convertPointsToSVGPath(this._points);
        if (this._isEmptySVGPath(pathData)) {
            // do not create 0 width/height paths, as they are
            // rendered inconsistently across browsers
            // Firefox 4, for example, renders a dot,
            // whereas Chrome 10 renders nothing
            this.canvas.requestRenderAll();
            return;
        }
        this.canvas.fire('before:path:created', { path: path });
        this.canvas.clearContext(this.canvas.contextTop);
        var path = this.createPath(pathData);
        path.setCoords();
        this._resetShadow();
        
        // fire event 'path' created
        this.canvas.fire('path:created', { path: path });
    }
});

export default LassoBrush;
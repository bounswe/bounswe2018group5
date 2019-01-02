/*
    ===============================================================
    Circle Selection component
    ===============================================================
    */
function circleSelector(svg) {
    var that = this;
    var circleCenter, circleOuter; //control points
    var circleSelected = false; //have we completed the circle?
    var dragging = false; //track whether we are dragging
    var active = false; // user can turn on/off this behavior
    var container = svg; // the container we render our points in

    // this will likely be overriden by leaflet projection
    var project = d3.geo.mercator();
    var unproject = d3.geo.mercator().invert;

    //we expose events on our component
    var dispatch = d3.dispatch("update", "clear");

    // The user provides an svg element to listen on events
    svg.on("mouseup.circle", function () {
        if (!active) return;
        if (dragging && circleSelected) return;

        var p = d3.mouse(this);
        var ll = unproject([p[0], p[1]])

        if (circleCenter) {
            // if we already have the circle's center and the circle
            // is finished selecting, another click means destroy the circle
            if (!circleSelected) {
                // Set the outer point
                circleOuter = ll;
                circleSelected = true;
            }
        } else {
            // We set the center to the initial click
            circleCenter = ll;
            circleOuter = ll;
        }
        // we let the user know
        update()
    });
    svg.on("mousemove.circle", function () {
        if (!active) return;
        if (circleSelected) return;
        // we draw a guideline for where the next point would go.
        var p = d3.mouse(this);
        var ll = unproject([p[0], p[1]])
        circleOuter = ll;
        update();
    });

    var drag = d3.behavior.drag()
        .on("drag", function (d, i) {
            if (!active) return;
            if (circleSelected) {
                dragging = true;
                var p = d3.mouse(svg.node());
                var ll = unproject([p[0], p[1]])
                if (i) {
                    circleOuter = ll;
                } else {
                    var dlat = circleCenter.lat - ll.lat;
                    var dlng = circleCenter.lng - ll.lng;
                    circleCenter = ll;
                    circleOuter.lat -= dlat;
                    circleOuter.lng -= dlng;
                }
                update();
            } else {
                return false;
            }
        })
        .on("dragend", function (d) {
            // kind of a dirty hack...
            setTimeout(function () {
                dragging = false;
            }, 100)
        });

    function update(g) {
        if (g) container = g;
        if (!circleCenter || !circleOuter) return;
        var dist = distance(circleCenter, circleOuter);
        var myDist = calcCrow(circleCenter.lat, circleCenter.lng, circleOuter.lat, circleOuter.lng);
        $('input[name=geocode]').val("{0},{1},{2}km".format(circleCenter.lat, circleCenter.lng, myDist));
        var circleLasso = container.selectAll("circle.lasso").data([dist]);
        circleLasso.enter().append("circle").classed("lasso", true)
            .on("click", function () {
                if (!active) return;
                // start over
                circleCenter = null;
                circleOuter = null;
                circleSelected = false;
                container.selectAll("circle.lasso").remove();
                container.selectAll("circle.control").remove();
                container.selectAll("line.lasso").remove();
                dispatch.clear();
            });
        circleLasso
            .attr({
                cx: project(circleCenter).x,
                cy: project(circleCenter).y,
                r: dist
            })
            .style({
                stroke: "#010",
                fill: "#010",
                "fill-opacity": 0.1
            });

        var line = container.selectAll("line.lasso").data([circleOuter])
        line.enter().append("line").classed("lasso", true)

        if (!circleSelected && circleCenter || dragging) {
            line.attr({
                x1: project(circleCenter).x,
                y1: project(circleCenter).y,
                x2: project(circleOuter).x,
                y2: project(circleOuter).y
            })
                .style({
                    stroke: "#111",
                    "stroke-dasharray": "5 5"
                })
        } else {
            line.remove();
        }

        var controls = container.selectAll("circle.control")
            .data([circleCenter, circleOuter])
        controls.enter().append("circle").classed("control", true)
        controls.attr({
            cx: function (d) {
                return project(d).x
            },
            cy: function (d) {
                return project(d).y
            },
            r: 8,
            stroke: "#010",
            fill: "#b7feb7",
            "fill-opacity": 0.9
        })
            .style({
                "cursor": active ? "move" : null
            })
            .call(drag)

        dispatch.update();
    }

    this.update = update;
    this.projection = function (val) {
        if (!val) return project;
        project = val;
        return this;
    };
    this.inverseProjection = function (val) {
        if (!val) return unproject;
        unproject = val;
        return this;
    };
    this.activate = function (val) {
        active = val;
        return this;
    };
    this.distance = function (ll) {
        if (!ll) ll = circleOuter;
        return distance(circleCenter, ll)
    };

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    function calcCrow(lat1, lon1, lat2, lon2)
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value)
    {
        return Value * Math.PI / 180;
    }

    function distance(ll0, ll1) {
        var p0 = project(ll0);
        var p1 = project(ll1);
        var dist = Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y))
        return dist;
    }

    d3.rebind(this, dispatch, "on");
    return this;
}
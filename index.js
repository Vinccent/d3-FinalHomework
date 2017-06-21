var w = 1000
var h = 600

var projection = d3.geoAlbersUsa()
    .translate([w / 2, h / 2])
    .scale([1000])

var path = d3.geoPath()
    .projection(projection)

var color = d3.scaleQuantize()      
    .range(["rgb(169,12,56)", "rgb(198,227,244)", "rgb(165,203,229)", "rgb(134,181,215)", "rgb(107,157,196)", "rgb(85,134,178)", "rgb(65,111,157)", "rgb(46,90,135)"])

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

//read GeoJson Data
d3.csv("data/states-profits.csv", function (data) {
    color.domain([
        d3.min(data, function (d) { return parseFloat(d.value) }),
        d3.max(data, function (d) { return parseFloat(d.value) })
    ]);
    d3.json("data/us-states.json", function (json) {
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state
            var dataValue = parseFloat(data[i].value)
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name
                if (dataState == jsonState) {
                    json.features[j].properties.value = dataValue
                    break
                }
            }
        }

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d",path)
            .style("fill", function(d) {
                var value = d.properties.value
                if (value)
                    return color(value)
                else
                    return "#ccc"
            })
            .on("mouseover",function(d) {
                d3.select(d.textElement).style("display","block").style("pointer-events",none)
            })
            .on("mouseout",function(d) {
                d3.select(d.textElement).style("display","none")
            });

        var text = svg.selectAll("text")
                        .data(json.features)
                        .enter()
                        .append("text")
                        .style("display","none")
                        .style("transform",function(d) {
                            d.textElement = this
                            return "translate(" + path.centroid(d)[0] + "px, " + path.centroid(d)[1] + "px"
                        })
        
        text.append("tspan")
            .text(function(d) {
                return d.properties.name
            })
        text.append("tspan")
            .text(function(d) {
                return d.properties.value
            })
            .attr("x",0)
            .attr("y",25)
    });
});



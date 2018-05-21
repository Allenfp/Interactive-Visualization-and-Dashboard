
var sampleListUrl = "/names"
var sampleMetaData = "/metadata/"
var sampleSampleURL = "/samples/"
var sampleOtuDesc = "/otu"
var wFreqUrl = "/wfreq/"

d3.json(sampleListUrl, function(error, sampleList) {
    if (error) {
        throw error;
    };

    sampleList.forEach(function(sample) {
        Plotly.d3
        .select('#sample_select')
        .append('option')
        .attr('value', sample)
        .text(sample)
    });
});

function changeData(sample) {

    d3.selectAll('li').remove();

    d3.json(sampleMetaData+sample, function(error, sampleMeta) {
 
        d3.select('#sample_info').append('li').attr('id', 'age').text('Age: '+ sampleMeta.age)
        .append('li').attr('id', 'bbType').text('BB Type: ' + sampleMeta.BBTYPE)
        .append('li').attr('id', 'ethnicity').text('Ethnicity: '+ sampleMeta.ETHNICITY)
        .append('li').attr('id', 'gender').text('Gender: ' + sampleMeta.GENDER)
        .append('li').attr('id', 'location').text('Location: ' + sampleMeta.LOCATION)
        .append('li').attr('id', 'sampleID').text('Sample ID: ' + sampleMeta.SAMPLEID)
        })

    d3.json(wFreqUrl+sample.toLowerCase(), function(error, sampleWF) {
        var level = sampleWF.wf * 20;
        console.log(level);

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [
            { type: 'scatter',
            x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'Frequency',
        },
        { 
            values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition:'inside',
            marker: {
                colors:[ 'rgba(14, 33, 0, .5)',
                            'rgba(14, 66, 0, .5)', 
                            'rgba(45, 99, 0, .5)',
                            'rgba(77, 127, 0, .5)', 
                            'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 
                            'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 
                            'rgba(232, 226, 202, .5)',
                            'rgba(255, 255, 255, 0)']
                    },
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false,

        }];

        var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }}],
            title: 'Average Weekly Cleaning Frequency',
            height: 500,
            width: 500,
            xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('needle_graph', data, layout);

    })

    d3.json(sampleSampleURL+sample, function(error, sampleSample) {

        var otuArray10 = []
        var otuArrayAll = []
        d3.json(sampleOtuDesc, function(error, otuDesc) {
            for (i = 0; i < sampleSample[1].sample_values.slice(0,10).length; i++) {
                otuArray10.push(otuDesc[sampleSample[0].otu_ids.slice(0,10)[i]])
            }
            for (i = 0; i < sampleSample[1].sample_values.length; i++) {
                otuArrayAll.push(otuDesc[sampleSample[0].otu_ids[i]])
            }

        })

        var pieData = [{
            values: sampleSample[1].sample_values.slice(0,10),
            labels: sampleSample[0].otu_ids.slice(0,10),
            hovertext: otuArray10,
            type: 'pie',
            showlegend: false
            }]

        var pieLayout = {
            autosize: false,
            width: 400,
            height: 400,
            title: 'Samples\'s 10 Most Prevalent Bacteria',
            margin: {
                l: 50,
                r: 10,
                b: 10,
                t: 40,
                pad: 4
            }}

        Plotly.newPlot('pie_graph', pieData, pieLayout)
        
        var bubbleData = [{
            y: sampleSample[1].sample_values,
            x: sampleSample[0].otu_ids,
            mode: 'markers',
            text: otuArrayAll,
            marker: {
                color: sampleSample[0].otu_ids,
                size: sampleSample[1].sample_values
            },
        }];

        var bubbleLayout = {
            autosize: false,
            width: 1200,
            height: 500,
            title: 'Prevalence by Bacterium (Mouse-over for details)',
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            }}

        Plotly.newPlot('bubble_graph', bubbleData, bubbleLayout)

    })
}

changeData("BB_940")

var sampleListUrl = "/names"
var sampleMetaData = "/metadata/"
var sampleSampleURL = "/samples/"
var sampleOtuDesc = "/otu"

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
            type: 'pie'
            }]

        var pieLayout = {
            autosize: false,
            width: 500,
            height: 500,
            margin: {
                l: 50,
                r: 10,
                b: 10,
                t: 10,
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
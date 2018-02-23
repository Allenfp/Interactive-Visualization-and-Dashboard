
var sampleListUrl = "/names"

Plotly.d3.json(sampleListUrl, function(error, sampleList) {
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

function changeData(sample) {}

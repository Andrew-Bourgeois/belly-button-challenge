// Use D3 library to read in 'samples.json' from url
// create the samples endpoint variable
const data_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// create variables to store data for: "names", "metadata", and "samples"
let sampleNames;
let sampleMeta;
let sampleSample;


// Fetch the json data and populate the initial idNo data
// NOTE: reference class exercise 14.3 Activity 10 for creating/running an init() function
function init() {
    d3.json(data_url).then(function (data) {
        console.log(data);
        sampleNames = data.names;
        sampleMeta = data.metadata;
        sampleSample = data.samples

        // fill initial drop down values
        let dropDownValues = d3.select("#selDataset");
        // for loop through the sample names to populate dropdown
        for (let i = 0; i < sampleNames.length; i++) {
            dropDownValues.append("option").text(sampleNames[i]).attr("value", sampleNames[i])
        };

        // display the initial value
        displaySelectedID(sampleNames[0]);
    });
}


// function to process the 'Test Subject ID No' selected from the drop down
function displaySelectedID(idNo) {
    // sort and select values for selected idNo
    // A review of the first id shows the sample_values are already sorted from largest to smallest.
    let idData = sampleSample.filter(sample => (sample.id == idNo.toString()))[0];
    let idMeta = sampleMeta.filter(meta => (meta.id == idNo))[0];

    // create/update the charts (could this be a function?)
    createCharts(idData, idMeta);
    // create update the Demographic info (could this be an additional function?)
    updateDemographics(idNo);
}

// function to create charts with idNo data
function createCharts(idNoData, idMetaData) {
    // create datasets
    let idNoIds = idNoData.otu_ids;
    let idNoValues = idNoData.sample_values;
    let idNoLabels = idNoData.otu_labels;

    // ************************ Bar Chart ******************************
    let traceBar = [{
        x: idNoValues.slice(0, 10).reverse(),
        y: idNoIds.slice(0, 10).map(ids => `OTU ${ids}`).reverse(),
        text: idNoLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    let layoutBar = {
        title: "10 Largest Bacteria Samples",
        margin: {
            t: 50,
            b: 40
        },
        //height: ,
        //width: 

    };
    Plotly.newPlot("bar", traceBar, layoutBar)
    // *****************************************************************

    // ********************* Bubble Chart ******************************
    let traceBubble = [{
        x: idNoIds,
        y: idNoValues,
       
        text: idNoLabels,
        mode: 'markers',
        marker: {
            size: idNoValues,
            color: idNoIds,
            // use Python built-in colorscale
            colorscale: "Earth"
        }
    }];
    let layoutBubble = {
        title: "# of Bacteria Per Sample",
        xaxis: { title: "OTU ID" },
        margin: {
            t: 30,
            b: 40,
            l: 50,
            r: 10,
            pad: 6
        },
    };
    Plotly.newPlot("bubble", traceBubble, layoutBubble);
    // *****************************************************************

    // ********************* Bubble Chart ******************************
    let traceGauge = [{
        value: idMetaData.wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {
                dtick: 1,
                range: [0, 9],
                tickcolor: "black",
                ticks: "inside"
            },
            bar: {
                color: "maroon",
                thickness: 0.5
            },
            bgcolor: "white",
            borderwidth: 1,
            bordercolor: "black",
            steps: [
                { range: [0, 1], color: "#F7F0E7" },
                { range: [1, 2], color: "#F1EEDE" },
                { range: [2, 3], color: "#E4E2BD" },
                { range: [3, 4], color: "#DFE4A1" },
                { range: [4, 5], color: "#CCE287" },
                { range: [5, 6], color: "#A8C57D" },
                { range: [6, 7], color: "#7AB573"  },
                { range: [7, 8], color: "#78B17B" },
                { range: [8, 9], color: "#72A876" },
            ]
        }
    }];
    let layoutGauge = {
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"
    };
    Plotly.plot("gauge", traceGauge, layoutGauge);

    // *****************************************************************
}

// function to fill 'demographic Info' Box
// Items: 'id: ', ' ethnicity: ', 'gender: ', 'age: ', location: ', 'bbtype: ', 'wfreq: '

function updateDemographics(idNo) {
    let metaData = sampleMeta.filter(meta => (meta.id == idNo))[0];;
    // select div holding metaData
    let metaDataDiv = d3.select("#sample-metadata");

    // update the sample-metadata div
    // clear out any existing p elements
    metaDataDiv.selectAll("p").remove();
    // create an array of key:value pairs to update the metadata 
    metaDataDiv.selectAll("p").data(Object.entries(metaData)).enter().append("p").text(d => `${d[0]}: ${d[1]}`);

};

// function to update all the cahrts upon selection using restyle()
function updateCharts(idNo) {
    let idData = sampleSample.filter(sample => (sample.id == idNo.toString()))[0];
    let idMeta = sampleMeta.filter(meta => (meta.id == idNo))[0];

    // create datasets
    let idNoIds = idData.otu_ids;
    let idNoValues = idData.sample_values;
    let idNoLabels = idData.otu_labels;

    // update Bar
    let barUpdate = {
        x: [idNoValues.slice(0, 10).reverse()],
        y: [idNoIds.slice(0, 10).map(ids => `OTU ${ids}`).reverse()],
        text: [idNoLabels.slice(0, 10).reverse()]
    };
    Plotly.restyle("bar", barUpdate);

    // update Bubble
    let bubbleUpdate = {
        x: [idNoIds],
        y: [idNoValues],
        text: [idNoLabels],
        "marker.size": [idNoValues],
        "marker.color": [idNoIds],
    }
    Plotly.restyle("bubble", bubbleUpdate);

    // update Gauge
    let gaugeUpdate = {
        value: idMeta.wfreq,
    }
    Plotly.restyle("gauge", gaugeUpdate);
};


// funciotn to make updates on change to selection
function optionChanged(idNo) {
    console.log("Value chang: ", idNo);
    updateCharts(idNo);
    updateDemographics(idNo)
};

init();
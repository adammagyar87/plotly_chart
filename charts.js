function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamplesArray = samplesArray.filter(x => x.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamplesArray[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var bar_otu_ids = firstSample.otu_ids;
    var bar_otu_labels = firstSample.otu_labels.slice(0,10).reverse();
    var bar_sample_values = firstSample.sample_values.slice(0,10).reverse();
    
    var bubble_otu_ids = firstSample.otu_ids;
    var bubble_otu_labels = firstSample.otu_labels;
    var bubble_sample_values = firstSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = bar_otu_ids.map(x => 'OTU' + x).slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: bar_sample_values,
      y: yticks,
      text: bar_otu_labels,
      type: 'bar',
      orientation: 'h' 
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

   
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: bubble_otu_ids,
      y: bubble_sample_values,
      text: bubble_otu_labels,
      mode: 'markers',
  marker: {
    color: bubble_otu_ids,
    size: bubble_sample_values
  }
  }]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

});
};
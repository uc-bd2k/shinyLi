/* require.config({
    baseUrl: "slisca",
    paths: {
             cytoscape: 'cytoscape.min',
             d3: 'd3.min',
             underscore: 'lodash.min',
             jqueryui: 'jquery-ui.min',
             jquery_throttle_debounce: 'jquery.ba-throttle-debounce.min',
             mediaelement: 'mediaelement-and-player.min',
             scatterplot_browser: 'scatterplot_browser',
             dose_response_grid: 'dose_response_grid',
             dose_response_curves: 'dose_response_curves',
             lib: 'js',
         },
    shim: {
        "scatterplot_browser": {
            deps: ['d3'],
            exports: "runLiScatterplot",
            init: function() { return { runLiScatterplot: runLiScatterplot } }

        },
        "dose_response_grid": {
            deps: ['d3'],
            exports: "runLiDoseResponseGrid",
            init: function() { return { runLiDoseResponseGrid: runLiDoseResponseGrid } }

        },
        "dose_response_curves": {
            deps: ['d3'],
            exports: "runLiDoseResponseCurves",
            init: function() { return { runLiDoseResponseCurves: runLiDoseResponseCurves } }

        }
    }
});
*/

$.ajaxSetup({async:false});
$.getScript("slisca/scatterplot_browser.js", function(){
});
$.getScript("slisca/dose_response_grid.js", function(){
});
$.getScript("slisca/dose_response_curves.js", function(){
});
$.getScript("slisca/d3-legend.min.js", function(){
});
$.getScript("slisca/d3.min.js", function(){
});
$.getScript("slisca/jquery-ui.min.js", function(){
});
$.ajaxSetup({async:true});

// require(["scatterplot_browser"]);
// require(["dose_response_grid"]);
// require(["dose_response_curves"]);

var shinyLi = {outputBindings: {}, inputBindings: {}};

shinyLi.outputBindings.liDoseResponseGrid = new Shiny.OutputBinding();
$.extend(shinyLi.outputBindings.liDoseResponseGrid, {
  find: function(scope) {
    return $(scope).find('.slisca-doseresponsegrid');
  },
  renderValue: function(el, data) {
       var outputId = this.getId(el);
       var obj=new DRG;
       obj.runLiDoseResponseGrid(data.input_file, data.data, data.xmin, data.xmax, data.factors, data.toggle, data.showfactorname, outputId);
  }
});
Shiny.outputBindings.register(shinyLi.outputBindings.liDoseResponseGrid);

var last_click=new Array();
shinyLi.inputBindings.liDoseResponseGrid = new Shiny.InputBinding();
$.extend(shinyLi.inputBindings.liDoseResponseGrid, {
  find: function(scope) {
    return $(scope).find('.slisca-doseresponsegrid');
  },
  getValue: function(el) {
       var outputId = this.getId(el);
      return last_click[outputId];
  },
  subscribe: function(el, callback) {
    var outputId = this.getId(el);
    $(el).on("click", function(e) {
       var selected_factor_values = [];
       $('#'+outputId+' #track li.picked').each(function(){
		selected_factor_values.push(encodeURIComponent($(this).text()));
      });  
      if (e.target.tagName=="path") {
	 // graph_index=d3.select($(e.target).parent()[0]).data();
	 title_text=$(e.target).parent().find("title").text();
      } else {
         // graph_index=d3.select(e.target).data();
	 title_text=$(e.target).find("title").text();
      }
      if (title_text!="" && title_text.slice(-1)!="=") {
        last_click[outputId]=selected_factor_values.join(',')+', '+title_text;
      } else {
	last_click[outputId]="";
      }
      // console.log("click index="+graph_index);
      // console.log("click last_click="+last_click[outputId]);
      callback();
    })
  }
});
Shiny.inputBindings.register(shinyLi.inputBindings.liDoseResponseGrid);

shinyLi.outputBindings.liDoseResponseCurves = new Shiny.OutputBinding();
$.extend(shinyLi.outputBindings.liDoseResponseCurves, {
  find: function(scope) {
    x= $(scope).find("#dose-response-curves-main");
    return x;
  },
  renderValue: function(el, data) {
     //require(["dose_response_curves"], function(dose_response_curves) {
        //dose_response_curves=require('dose_response_curves');
        //dose_response_curves.runLiDoseResponseCurves(data.input_file);
        runLiDoseResponseCurves(data.input_file);
     //});
   }
});
Shiny.outputBindings.register(shinyLi.outputBindings.liDoseResponseCurves);

shinyLi.outputBindings.liScatterplot = new Shiny.OutputBinding();
$.extend(shinyLi.outputBindings.liScatterplot, {
  find: function(scope) {
    x= $(scope).find("#main");
    return x;
  },
  renderValue: function(el, data) {
     // console.log(JSON.stringify(data));
    // define(function (require) { var namedModule = require('name'); });
    //require(["scatterplot_browser"], function(scatterplot_browser) {
       //scatterplot_browser=require('scatterplot_browser');
       //scatterplot_browser.runLiScatterplot(data.input_file, data.data);
       runLiScatterplot(data.input_file, data.data, data.factors);
    //});
  }
});
Shiny.outputBindings.register(shinyLi.outputBindings.liScatterplot);


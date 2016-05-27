library(shiny)
library(shinyLi)
   fluidPage(
       mainPanel(
	   # title("Examples")
           textInput("datasetScatterplot", NULL, value = "slisca/scatterplot_data.tsv")
           , actionButton("goButtonScatterplot", "Go")
           , liScatterplot(anchorId="main")
	   , actionButton("goButtonCurves", "Go")
           , liDoseResponseCurves(anchorId="dose-response-curves-main")
           , textInput("datasetGrid", NULL, value = "slisca/dose_response_data.tsv")
           , actionButton("goButtonGrid", "Go")
           , liDoseResponseGrid(anchorId="dose-response-grid-main")
     , width=12)
)


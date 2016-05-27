library(shiny)
library(shinyLi)
   fluidPage(
       mainPanel(
	   textInput("dataset", NULL, value = "slisca/dose_response_data.tsv")
	   , actionButton("goButton", "Go")
           , liDoseResponseGrid(anchorId="dose-response-grid-main")
	   , tags$hr()
	   , textInput("dataset-two", NULL, value = "slisca/dose_response_data.tsv")
	   , actionButton("goButton-two", "Go")
           , liDoseResponseGrid(anchorId="dose-response-grid-main-two")
     , width=12)
)


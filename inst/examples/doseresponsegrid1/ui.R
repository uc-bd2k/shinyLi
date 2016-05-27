library(shiny)
library(shinyBS)
library(shinyLi)
   fluidPage(
       mainPanel(
	   # textInput("dataset", NULL, value = "slisca/dose_response_data.tsv")
	   actionButton("goButton", "Go"),
	   selectizeInput('choiceVar', 'Select dynamic variable', choices = NULL),
     	   selectizeInput('groupingVars', 'Select grouping variables', choices = NULL, multiple = TRUE),
	   selectizeInput('EC50', 'Select EC50 variable', choices = NULL, multiple = TRUE),
	   selectizeInput('Einf', 'Select Einf variable', choices = NULL, multiple = TRUE),
	   selectizeInput('HillSlope', 'Select HillSlope variable', choices = NULL, multiple = TRUE),
	   numericInput("xmin", "Xmin", value=0),
	   numericInput("xmax", "Xmax", value=0),
	   verbatimTextOutput("verbDebug"),
	   bsModal("graphPopup", "Graph Popup", "triggerGraphPopup", # size = "large",
               textInput("graphPopupText", label = "", value = "")
               # , actionButton("Close", label = "graphPopupClose")
           ),

     # liDoseResponseGrid(anchorId="dose-response-grid-main"), width=12)
     liDoseResponseGrid('drg'), width=12)
)


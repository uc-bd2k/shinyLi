library(shiny)
library(shinyLi)
   fluidPage(
       mainPanel(
	   actionButton("goLog", "Log")
	   , actionButton("goButton", "Go")
           , liDoseResponseCurves(anchorId="dose-response-curves-main")
     , width=12)
)


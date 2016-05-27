library(shiny)
library(shinyLi)
   fluidPage(
       mainPanel(
             tabsetPanel(
                tabPanel("Scatterplot",
           		 liScatterplot(anchorId="main")
                )
                ,
                 tabPanel("Dose Response Grid",
                        liDoseResponseGrid(anchorId="dose-response-grid-main")
           		      
                 )
	    )
	    , width=12)
)


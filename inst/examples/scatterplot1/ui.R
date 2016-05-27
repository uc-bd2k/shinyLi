library(shiny)
library(shinyLi)
   fluidPage(
       mainPanel(
         fluidRow(
           column(3, selectizeInput('choiceVar', 'Selector variable', choices = NULL)),
           column(3, selectizeInput('groupingVars', 'Grid variables', choices = NULL, multiple = TRUE)),
           column(3, br(),actionButton("goButton", "Go"))
         , width=12
	),
         fluidRow(
           liScatterplot(anchorId="main")
         , width=12
	)
     )
)


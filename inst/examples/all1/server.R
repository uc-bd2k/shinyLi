library(shiny)
library(shinyLi)
shinyServer(
   function(input, output, session) {

    observeEvent(input$goButtonCurves, {
     output$'dose-response-curves-main' <- renderLiDoseResponseCurves({ input="1" })
    })

    observeEvent(input$goButtonGrid, {
     output$'dose-response-grid-main' <- renderLiDoseResponseGrid({ input=input$datasetGrid })
    })

    observeEvent(input$goButtonScatterplot, {
     output$main <- renderLiScatterplot({ input=input$datasetScatterplot })
    })

   }
)

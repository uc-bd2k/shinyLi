library(shiny)
library(shinyLi)
shinyServer(
   function(input, output, session) {

    observeEvent(input$goLog, {
	showReactLog()
	})

    observeEvent(input$goButton, {
     
     output$'dose-response-curves-main' <- renderLiDoseResponseCurves({
	input="1"
     })

     })

   }
)

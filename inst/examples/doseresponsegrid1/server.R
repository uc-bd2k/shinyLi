library(shiny)
library(shinyLi)
library(ggplot2)
library(jsonlite)

extractGridData <- function(input, output, data, name_factors) {

#data1 <- data[c('Cell line','Small Molecule','Seeding density','Replicate','EC50 for GR curve','Einf for GR curve','Hill coeff. for GR curve')]
#colnames(data1) <- c('cell line','drug','seeding_density','Replicate','EC50','Einf','HillSlope')
#data1['drug'] <- apply(data1[,c('drug','seeding_density','Replicate')],1,function(x){paste(x[1],x[2],x[3],sep="_")})
#data1['drug'] <- apply(data1[,c('drug','seeding_density')],1,function(x){paste(x[1],x[2],sep="_")})

if (!(is.null(input$choiceVar) || is.null(input$groupingVars) || is.null(input$EC50) || 
      is.null(input$Einf) && is.null(input$HillSlope))) {
  data1 <- data
  data1[[input$choiceVar]] <- data[[input$choiceVar]]
  data1[[name_factors]] <- do.call(paste, c(as.data.frame(data[input$groupingVars], stringsAsFactors=FALSE),sep="_"))
  data1['EC50'] <- data[input$EC50]
  data1['Einf'] <- data[input$Einf]
  data1['HillSlope'] <- data[input$HillSlope]
  data1['log10[EC50]'] <- lapply(data1['EC50'], log10)
  data1
} else {
  NULL
}
}



shinyServer(
   function(input, output, session) {

  # datafile<-"../../www/SeedingDensity_72h_GR_metrics_2016-01-11.tsv"
  # datafile<-"../../www/Heiser2012_GR_metrics_2015-12-11.tsv"
  datafile<-"../../www/error.tsv"
  data <- read.table(datafile, sep="\t", header=TRUE, check.names=FALSE, fill=TRUE)

  updateSelectizeInput(session, 'choiceVar', choices = colnames(data), server = TRUE, selected="Cell line")
  updateSelectizeInput(session, 'groupingVars', choices = colnames(data), server = TRUE, selected=c("Small Molecule"))
  updateSelectizeInput(session, 'EC50', choices = colnames(data), server = TRUE, selected="EC50 for GR curve")
  updateSelectizeInput(session, 'Einf', choices = colnames(data), server = TRUE, selected="Einf for GR curve")
  updateSelectizeInput(session, 'HillSlope', choices = colnames(data), server = TRUE, selected="Hill coeff. for GR curve")

   observeEvent(input$goButton, {

     name_factors <- paste(input$groupingVars,collapse = '_')
     # output$'dose-response-grid-main' <- renderLiDoseResponseGrid
     output$drg <- renderLiDoseResponseGrid(
       input="",
       xmin=isolate(input$xmin),
       xmax=isolate(input$xmax),
       factors=c(input$choiceVar ,name_factors),
       toggle=1,
       {
         input$goButton
         
         isolate(extractGridData(input, output, data, name_factors))
       }
     )

    })

    observeEvent(input$drg, {
	graphParams <- input$drg
	output$verbDebug<-renderText({ input$drg })
        if (graphParams != "") {
		updateTextInput(session, "graphPopupText", value = graphParams)
		toggleModal(session,"graphPopup")
	}
    })

    observeEvent(input$graphPopupClose, {
      toggleModal(session,"graphPopup")
    })

   }
)

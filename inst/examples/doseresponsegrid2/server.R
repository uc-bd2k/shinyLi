library(shiny)
library(shinyLi)
shinyServer(
   function(input, output, session) {

    observeEvent(input$goButton, {

     # data <- read.table("../../www/dose_response_data.tsv", sep="\t", header=TRUE, check.names=FALSE);
 
      datafile="../../www/SeedingDensity_72h_GR_metrics_2016-01-11.tsv"
     data <- read.table(datafile, sep="\t", header=TRUE, check.names=FALSE, fill=TRUE)
     data1 <- data[c('Cell line','Small Molecule','EC50 for IC curve','Einf for IC curve','Hill coeff. for IC curve')]
     colnames(data1) <- c('cell line','drug','log10[EC50 (M)]','E_inf','HillSlope')
     
     data1['log10[EC50 (M)]'] <- lapply(data1['log10[EC50 (M)]'], log10)

     output$'dose-response-grid-main' <- renderLiDoseResponseGrid(
	 input="", # input$dataset,
	data1	
     )

     })

    observeEvent(input$'goButton-two', {

     output$'dose-response-grid-main-two' <- renderLiDoseResponseGrid(
	 input=input$dataset-two,
     )

     })

   }
)

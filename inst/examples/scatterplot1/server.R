library(shiny)
library(shinyLi)

populate_scatterplot <- function(input, output, data) {
    # cell line       
    # drug    
    # target  
    # log10[IC50 (M)] 
    # log10[GI50 (M)] 
    # log2[HillSlope] 
    # E_max
    
    # data1 <- data[     c('Cell line','Small Molecule','Small Molecule','EC50 for GR curve','GR50',           'Hill coeff. for GR curve','Emax')]
    # colnames(data1) <- c('cell line','drug',          'target',   'log10[IC50 (M)]',  'log10[GI50 (M)]','log2[HillSlope]',         'E_max')
    
    # data_scatterplot <- data[     c('Cell line','Small Molecule','GR50','GRmax','Hill coeff. for GR curve','Einf for GR curve')]
    # colnames(data_scatterplot) <- c('cell line','drug',          'GR50','GRmax','HillSlope','GRinf')

    data_scatterplot <- data[     c('Cell',     'Drug','Density','Value')]
    colnames(data_scatterplot) <- c('cell line','drug','density','GR50')

    # data_scatterplot[[input$choiceVar]] <- data_scatterplot[[input$choiceVar]]
    data_scatterplot[[paste(input$groupingVars,collapse = '_')]] <- do.call(paste, c(as.data.frame(data_scatterplot[input$groupingVars], stringsAsFactors=FALSE),sep="_"))

    data_scatterplot['GRmax'] <- data_scatterplot['GR50']
    data_scatterplot['HillSlope'] <- data_scatterplot['GR50']
    data_scatterplot['GRinf'] <- data_scatterplot['GR50']

    data_scatterplot['log10[GR50]'] <- lapply(data_scatterplot['GR50'], log10)
    data_scatterplot['log2[HillSlope]'] <- lapply(data_scatterplot['HillSlope'], log2)
    
    data_scatterplot
  
}

shinyServer(
   function(input, output, session) {

    choices<-c("cell line","drug","density");

    # load
    updateSelectizeInput(session, 'choiceVar', choices = choices, server = TRUE, selected=choices[1])
    updateSelectizeInput(session, 'groupingVars', choices = choices, server = TRUE, selected=choices[-1])
 
    observeEvent(input$goButton, {
       datafile="../../www/test.tsv"
       data <- read.table(datafile, sep="\t", header=TRUE, check.names=FALSE, fill=TRUE)
     
       data_scatterplot <- populate_scatterplot(input, output, data)
       output$main <- renderLiScatterplot(
         input="", # input$dataset,
         factors=c(input$choiceVar, paste(input$groupingVars,collapse = '_')),
         data_scatterplot
       )
    })
   }
)


library(shiny)
library(shinyLi)

populate_doseresponsegrid <- function(output, data) {
  data_doseresponsegrid <- data[c('Cell line','Small Molecule','GR50','GRmax','Hill coeff. for GR curve')]
  colnames(data_doseresponsegrid) <- c('cell line','drug','GR50','GRmax','HillSlope')
  
  data_doseresponsegrid['log10[GR50]'] <- lapply(data_doseresponsegrid['GR50'], log10)
  
  output$'dose-response-grid-main' <- renderLiDoseResponseGrid(
    input="", # input$dataset,
    data_doseresponsegrid	
  )
}

populate_scatterplot <- function(output, data) {
  # cell line       
  # drug    
  # target  
  # log10[IC50 (M)] 
  # log10[GI50 (M)] 
  # log2[HillSlope] 
  # E_max
  
  # data1 <- data[     c('Cell line','Small Molecule','Small Molecule','EC50 for GR curve','GR50',           'Hill coeff. for GR curve','Emax')]
  # colnames(data1) <- c('cell line','drug',          'target',   'log10[IC50 (M)]',  'log10[GI50 (M)]','log2[HillSlope]',         'E_max')
  
  data_scatterplot <- data[     c('Cell line','Small Molecule','GR50','GRmax')]
  colnames(data_scatterplot) <- c('cell line','drug','GR50','GRmax')
  
  
  data_scatterplot['log10[GR50]'] <- lapply(data_scatterplot['GR50'], log10)
  
  output$main <- renderLiScatterplot(
    input="",
    data_scatterplot
  )
  
}

shinyServer(
  function(input, output, session) {
    datafile="../../www/SeedingDensity_72h_GR_metrics_2016-01-11.tsv"
    data <- read.table(datafile, sep="\t", header=TRUE, check.names=FALSE, fill=TRUE)
    
    populate_scatterplot(output, data)
    populate_doseresponsegrid(output, data)
  }
)

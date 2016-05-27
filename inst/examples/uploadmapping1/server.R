library(shiny)
library(shinyLi)

# dose response data:
# cell line       
# drug    
# target  
# log10[max. dose (M)]    
# R^2 (goodness of fit)   
# log10[EC50 (M)] 
# log10[IC50 (M)] 
# log10[GI50 (M)] 
# HillSlope       
# E_inf   
# E_max   
# AUC

# scatterplot data:
# cell line       
# drug    
# target  
# log10[IC50 (M)] 
# log10[GI50 (M)] 
# log2[HillSlope] 
# E_max

# my data:
# Cell HMSLID
# Cell line
# Small Molecule HMSLID
# Small Molecule
# Seeding density
# Replicate
# IC50
# Emax
# AUC
# IC curve fit
# r2 for IC curve
# EC50 for IC curve
# Einf for IC curve
# Hill coeff. for IC curve
# GR50
# GRmax
# AUC_GR
# GR curve fit
# r2 for GR curve
# EC50 for GR curve
# Einf for GR curve
# Hill coeff. for GR curve
read_data <- function(output, datafile) {
  data <- read.table(datafile, sep="\t", header=TRUE, check.names=FALSE, fill=TRUE)
  data1 <- data[c('Cell line','Small Molecule','EC50 for IC curve','Einf for IC curve','Hill coeff. for IC curve')]
  colnames(data1) <- c('cell line','drug','EC50 for IC curve','E_inf','HillSlope')
  
   output$'dose-response-grid-main' <- renderLiDoseResponseGrid(
     input="",
    data1
  )
  
#  datacolmap <- data.frame(colnames(data),colnames(data),1)
  
#  colnames(datacolmap) <- c("Orig Name", "Mapped Name", "id")
#  output$coltable <- DT::renderDataTable(DT::datatable({ datacolmap }))
  
#   output$coltable <- DT::renderDataTable({
#     addCheckboxButtons <- paste0('<input type="checkbox" name="row', datacolmap$id, '" value="', datacolmap$id, '">',"")
#     #Display table with checkbox buttons
#     # cbind(Pick=addCheckboxButtons, datacolmap[, input$show_vars, drop=FALSE])
#     cbind(Pick=addCheckboxButtons, datacolmap)
#   }, options = list(orderClasses = TRUE, lengthMenu = c(5, 25, 50), pageLength = 25)
#   , callback = "function(table) {
#   table.on('change.dt', 'tr td input:checkbox', function() {
#   setTimeout(function () {
#   Shiny.onInputChange('rows', $(this).add('tr td input:checkbox:checked').parent().siblings(':last-child').map(function() {
#   return $(this).text();
#   }).get())
#   }, 10); 
#   });
# }")
 #      output$dataset <- DT::renderDataTable(DT::datatable({ data1 }))
       
}

shinyServer(
   function(input, output, session) {

     observeEvent(input$loadExample, {
       read_data(output, 'SeedingDensity_72h_GR_metrics_2016-01-11.tsv')
    })
     
     observeEvent(input$uploadData, {
       inFile <- input$uploadData
       
       if (is.null(inFile))
         return(NULL)
       
       read_data(output, inFile$datapath)
      })

   }
)

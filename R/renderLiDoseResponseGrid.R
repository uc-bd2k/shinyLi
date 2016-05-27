#'Render dose response grid
#'
#'\code{renderLiDoseResponseGrid} 
#'
#'@param input filename to load
#'@param data data to render (if input filename is blank)
#'@param xmin x axis min
#'@param xmax x axis max
#'
#'@templateVar item_name renderLiDoseResponseGrid
#'@templateVar family_name renderLiDoseResponseGrid
#'@template item_details
#'@template footer
#'@export
renderLiDoseResponseGrid <- function(data=NULL, input=NULL, xmin=0, xmax=0, factors=NULL, toggle=NULL) {
  reactive({
    list(input_file=input,
    data=jsonlite::toJSON(data),
    xmin=xmin, xmax=xmax,
    factors=jsonlite::toJSON(factors),
    toggle=toggle)
  })
}

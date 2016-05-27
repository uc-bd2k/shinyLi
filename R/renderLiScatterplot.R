#'Render scatterplot.
#'
#'\code{renderLiScatterplot} 
#'
#'@param input A unique id the identifies the anchor.
#'
#'@templateVar item_name renderLiScatterplot
#'@templateVar family_name renderLiScatterplot
#'@template item_details
#'@template footer
#'@export
renderLiScatterplot <- function(data=NULL, input=NULL, factors=NULL) {
  reactive({
    list(input_file=input,
        data=jsonlite::toJSON(data),
	factors=jsonlite::toJSON(factors)
	)
  })
}

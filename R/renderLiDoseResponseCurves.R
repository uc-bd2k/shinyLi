#'Render dose response curves.
#'
#'\code{renderLiDoseResponseCurves} 
#'
#'@param input A unique id the identifies the anchor.
#'
#'@templateVar item_name renderLiDoseResponseCurves
#'@templateVar family_name renderLiDoseResponseCurves
#'@template item_details
#'@template footer
#'@export
renderLiDoseResponseCurves <- function(input) {
  reactive({
    list(input_file=input)
  })
}

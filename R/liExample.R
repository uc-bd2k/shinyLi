#'Run embedded examples.
#'
#'A function to view examples of shinyLi functionality. Will run the examples
#'found in the examples sections of shinyLi documentation. Use this instead of 
#'\code{example}. 
#'
#'@param family A shinyLi family name
#'@param display.mode The display mode to use when running the example. See
#'\code{\link{runApp}}.
#'@param \dots Other parameters to pass to \code{\link{runApp}}.
#'
#'@details
#'This function is just a wrapper for \code{\link{runApp}} that runs copies of the
#'examples found in the family documention pages of \code{shinyLi}. By default,
#'\code{display.mode} is set to \code{showcase} so you can see the code while 
#'the app is running.
#'
#'@examples
#'\dontrun{
#'    liExample("scatterplot1")}
#'@export
liExample <- function(family, display.mode = "showcase", ...) {
# liExample <- function(family, display.mode = "normal", ...) {
 
  exp <- system.file("examples", package="shinyLi")
  fams <- list.dirs(exp, full.names = FALSE, recursive = FALSE)
  
  appname <- gsub(" ", "", family, fixed = TRUE)
  appname <- gsub("_", "", appname, fixed = TRUE)
  
  if(appname %in% fams) {
    
    appname <- normalizePath(paste0(exp, "/", appname))
    shiny::runApp(appname, display.mode = display.mode, ...)
  
  } else {
   
    stop("Could not find shinyLi family: ", family, "\nAvailable families are: ", paste0(fams, collapse = ", "))
    
  }
  
}

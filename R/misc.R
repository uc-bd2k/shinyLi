library(jsonlite)

.onAttach <- function(...) {

  # Create link to javascript and css files for package
  shiny::addResourcePath("slisca", system.file("www", package="shinyLi"))

}

shinyLiDep <- htmltools::htmlDependency("shinyLi", 
         packageVersion("shinyLi"), 
         src = c("href" = "slisca"), 
         script = c("shinyLi.js"), 
         # script = c("jquery-ui.min.js","require.js","shinyLi.js"), 
         stylesheet = c("shinyLi.css","dose_response_curves.css","dose_response_grid.css","scatterplot_browser.css","jquery-ui.min.css"))

# Copy of dropNulls function for shiny to avoid using shiny:::dropNulls
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE = logical(1))]
}

# Takes a tag and removes any classes in the remove argument
removeClass <- function(tag, remove) {

  if(length(remove) == 1) remove <- strsplit(remove, " ", fixed = TRUE)[[1]]
  class <- strsplit(tag$attribs$class, " ", fixed = TRUE)[[1]]
  class <- class[!(class %in% remove)]
  tag$attribs$class <- paste(class, collapse = " ")

  return(tag)

}

addClass <- function(tag, add) {
  tag$attribs$class <- paste(tag$attribs$class, add)
  return(tag)
}

addAttribs <- function(tag, ...) {
  a <- list(...)
  for(i in seq(length(a))) {
    tag$attribs[names(a)[i]] = a[[i]]
  }
  return(tag)
}

removeAttribs <- function(tag, ...) {
  a <- list(...)
  for(i in seq(length(a))) {
    tags$attribs[a[[i]]] = NULL
  }
  return(tag)
}

getAttribs <- function(tag) {
  tag$attribs
}


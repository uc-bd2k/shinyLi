#'Create dose response grid UI.
#'
#'\code{liDoseResponseGrid} creates an anchor point in your UI definition. This anchor point
#'is where alerts created in your Server logic will be displayed. 
#'
#'@param anchorId A unique id the identifies the anchor.
#'
#'@templateVar item_name liDoseResponseGrid
#'@templateVar family_name liDoseResponseGrid
#'@template item_details
#'@template footer
#'@export
liDoseResponseGrid <- function(anchorId) {
 
  # liTag <- shiny::tags$div(class = "slisca-doseresponsegrid", id = anchorId, " ")

  liTag <- withTags({
  div(id=anchorId, class="main global slisca-doseresponsegrid", # loading
    HTML('
    <div class="slider" style="visibility:hidden">
      <div id="dose-response-grid-content" class="content main-content">
        <div class="vfloat">
          <div id="track" class="track-container">
            <div id="toggle" class="button-bar">
              <button>Toggle view</button>
            </div>
            <div class="list-container-base list-container">
              <ul><div class="title"></div></ul>
              <br>
              <div class="button-bar"><button id="reset" disabled>reset</button></div>
            </div>
          </div> <!-- #track -->
        </div>
        <div class="right-panel">
          <div id="grid" class="svg-table"></div>
        </div>
      </div> <!-- #dose-response-grid-content -->
    </div> <!-- .slider -->
  ')
  , div(id="loading", div("data not loaded..."))
)
})

  htmltools::attachDependencies(liTag, shinyLiDep)
}



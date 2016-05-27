#'Create dose response curves UI.
#'
#'\code{liDoseResponseCurves} creates an anchor point in your UI definition. This anchor point
#'is where alerts created in your Server logic will be displayed. 
#'
#'@param anchorId A unique id the identifies the anchor.
#'
#'@templateVar item_name liDoseResponseCurves
#'@templateVar family_name liDoseResponseCurves
#'@template item_details
#'@template footer
#'@export
liDoseResponseCurves <- function(anchorId) {
 
  liTag <- shiny::tags$div(class = "slisca-doseresponsecurves", id = anchorId, " ")

  liTag <- withTags({
  div(id=anchorId, class="main global", # loading
    HTML('
        	<div id="graph-container">

         <div class="xcontainer" id="graph0"></div>
         
         <div class="xcontainer" id="graph"></div>
         
         <div class="xcontainer" id="graph2"></div>
         
         </div>
         
         
         
         <div id="control-panel">
         
         <div id="controls">
         
         <div id="sliders">
         
         <table><tbody>
         
         <tr><td style="text-align:right"><b>Cell division time (T<sub>d</sub>)</b></td><td><div class="slider" id="Td-slider"></div></td><td><div class="slider-value" id="Td-slider-value">1.3</div></td></tr>
         
         <tr><td>&nbsp;</td></tr>
         
         <tr><td>&nbsp;</td></tr>
         
         <tr><td style="text-align:right">Potency of the drug (SC<sub>50</sub>)</td><td><div class="slider" id="SC50-slider"></div></td><td><div class="slider-value" id="SC50-slider-value">1.2</div></td></tr>
         
         <tr><td>&nbsp;</td></tr>
         
         <tr><td style="text-align:right">Maximal effect of the drug</td><td><div class="slider" id="Smax-slider"></div></td><td><div class="slider-value" id="Smax-slider-value">0.65</div></td></tr>
         
         <tr><td style="text-align:right">on cell division (SC<sub>max</sub>)</td></tr>
         
         <tr><td style="text-align:right">Hill slope (h)</td><td><div class="slider"
         
         id="HS-slider"></div></td><td><div class="slider-value" id="HS-slider-value">1.6</div></td></tr>
         
         
         
         </tbody></table>
         
         </div> <!-- #sliders -->
         
         
         
         <div id="presets">
         
         <table><tbody>
         
         <tr>
         
         <td><button class="preset">cytostatic</button></td>
         
         <td><button class="preset">partial cytostatic</button></td>
         
         <td><button class="preset">cytotoxic</button></td>
         
         
         
         </tr>
         
         </tbody></table>
         
         </div> <!-- #presets -->
         
         </div> <!-- #controls -->
         
         </div> <!-- #control-panel -->
  ')
)
})

  htmltools::attachDependencies(liTag, shinyLiDep)
}



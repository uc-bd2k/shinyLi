#'Create scatterplot UI.
#'
#'\code{liScatterplot} creates an anchor point in your UI definition. This anchor point
#'is where alerts created in your Server logic will be displayed.
#'
#'@param anchorId A unique id the identifies the anchor.
#'
#'@templateVar item_name liScatterplot
#'@templateVar family_name liScatterplot
#'@template item_details
#'@template footer
#'@export
liScatterplot <- function(anchorId) {
 
  liTag <- shiny::tags$div(class = "slisca-scatterplot", id = anchorId, " ")

  liTag <- withTags({
  div(id=anchorId, class="loading global",
    HTML('<div class="centered-track">
      <div id="help" class="pulldown">

        <div>
          <p>USAGE:</p>
          <ul>
            <li>first specify the desired plot type (if necessary);</li>
            <li>next, choose the entity corresponding to the <i>x</i>-axes by clicking on its name in the Selection Panel; this choice serves as the "anchor" for all subsequent selections, but it can be changed easily, as described below;</li>
            <li>finally, select one or more entities for the <i>y</i>-axes, by clicking on their names; selecting an entity for the <i>y</i>-axis in this way amounts to selecting a new pair; each newly selected pair gets added to a running list of selected pairs, shown below the Selection Panel; this list of selected pairs persists until the <span class="button-reference">clear</span> button is pressed, or the current plot type is changed;</li>
            <li>to select a different "anchor" for the <i>x</i>-axes, click on the previously selected one to deselect it (this will not affect any previously selected pairs), and then proceed as before; (it is possible to choose the <i>x</i>-axis identifier also for the <i>y</i>-axis, by holding down the shift key while clicking on the <i>x</i>-axis identifier the second time).</li>
          </ul>
          <p>NOTES:</p>
          <ul>
            <li>the thin marks along either axis correspond to points for which only the coordinate for that axis is available;</li>
            <li>a cross-shaped mark represents points for which neither coordinate is available (such a cross-shaped mark, when present, always appears on the diagonal, near the lower left corner of the plot);</li>
            <li>hovering the cursor over a marker in the scatterplot highlights all the other markers (across all the plots) corresponding to the drug or cell line associated with it, and, after a short wait, it also brings up the name of this drug or cell line;
            <li>performance and appearance vary across web browsers; in our experience, Chrome is best, followed by Safari, Firefox, Internet Explorer (11+), and Opera, in roughly that order.</li>
          </ul>
        </div>
      </div> <!-- #help .pulldown -->
      <div class="tab">
        <div class="corner-dingbat"><div><div><span>i</span></div></div></div>
      </div>
      <div id="widget" class="content">
        <table><tr>
          <td id="left-panel">
             <div id="clear"><button>clear</button></div><br class="clear-right"/>
             <div class="buttons">
               <div id="factor-group" class="radio-button-group">
                 <div class="group-label">plot type:</div>
                 <div>
                   <label> <input type="radio" value="cell line"> cell line vs. cell line </label>
                   <label> <input type="radio" value="drug">      drug vs. drug           </label>
                 </div>
               </div>
             </div>
             <div id="picker-container">
               <div id="picker" class="list-container">
                 <ul>
                   <div class="title"></div>
                 </ul>
                 <br>
               </div> <!-- #picker -->
             </div> <!-- #picker-container -->
             <div id="legend">
               <ul></ul>
             </div>
          </td> <!-- #left-panel -->
          <td id="right-panel">
            <div class="stage" id="liscatterplot-stage"></div>
          </td>
        </tr></table>
      </div> <!-- .content -->
    </div> <!-- .centered-track -->
  '))
})


htmltools::attachDependencies(liTag, shinyLiDep)
}



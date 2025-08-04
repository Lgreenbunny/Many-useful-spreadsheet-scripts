/*
  given the goalSheet Sheet object, 
  a starting range 
  and a 2D array arr (not Range), 
  
  push an entire block to the goalSheet's range.
*/

//a2:c for the recipeStarter startingRange, tally for goalSheet, sheetarr for arr, just for testing
function rangeTransfer(goalSheet, coords, arr) {
  return new Promise((resolve)=>{
    console.log("coords");
    console.log(coords);
    const goalRange = goalSheet.getRange(...coords);
    goalRange.setValues(arr);

    resolve(`Successfully copied range to sheet ${goalSheet.getSheetName()}.`);
  });
}

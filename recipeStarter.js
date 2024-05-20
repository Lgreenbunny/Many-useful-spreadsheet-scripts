async function onOpen(e){
  SpreadsheetApp.getUi().createMenu('Calculator sidebar').addItem('Turn on', "sidebarManager").addToUi();
  await menuSet();
  await starterButton();
}

//starts the script with the current spreadsheet if the launch came from that, other functions may call recipeStarter directly for testing.
async function starterButton(){
  await recipeStarter(SpreadsheetApp.getActiveSpreadsheet());
}
/*
  should delete the entire crafting tally list and start printing from blank cells whenever it starts being edited
*/

//prints the currently selected game to the "crafting tally" sheet so the user can select how many to craft
async function recipeStarter(theSpreadsheet) {//if not called from onOpen, the test script can plug in a spreadsheet ID if it has permission to edit it

  var tally = theSpreadsheet.getSheetByName("crafting tally");

  //[tallyRangeStr,	game dropdown/target sheet name,	targetSheetArr,	targetIngredientArr]////////////////
  var refs = theSpreadsheet.getSheetByName("Refs").getRange("C3:F3").getValues()[0];
  
  
  //clear the entries in crafting tally
  const tallyRangeStr = refs[0];
  const tallyRangeChar = tallyRangeStr.charAt(0), tallyRangeRow = tallyRangeStr.charAt(1);
  tally.getRange(tallyRangeStr).clearContent();

  const targetSheetName = tally.getRange(refs[1]).getValue();
  const sheetArr = theSpreadsheet.getSheetByName(targetSheetName)
    .getRange(refs[2]).getValues();
  const ingredientArr = theSpreadsheet.getSheetByName(targetSheetName)
    .getRange(refs[3]).getValues();

  //load all the first 4 columns of sheetArr into a condensed arr, with 1 cell from the condensed column
  //return a 2d column of condensed entries
  const condensedSheetCol = await condenseIngredient(ingredientArr);
  const resultArr = [];
  //combine
  for(var i = 0; i < condensedSheetCol.length; i++)
    resultArr.push([...sheetArr[i], condensedSheetCol[i][0]]);
  
  /*console.log(`result arr after combining the ingredient rows, then combining that arr with sheetArr:`);
  console.log(resultArr)*/

  //for each filled recipe entry in the result, push/copy to tally's B2:D row
  const coords = await rangeStarter(tallyRangeChar, tallyRangeRow, resultArr);
  console.log("rangeStarter result while in recipeStarter:");
  console.log(coords);
  return await rangeTransfer(tally, coords, resultArr);
}

//condense the ingredients then put in the 4th col
function condenseIngredient(rangeArr){
  return new Promise((resolve)=>{
    const result = [];
    for(var row = 0; row < rangeArr.length; row++){
      var temp = "";
      for(var col = 0; col < rangeArr[row].length; col++){
        //no more entries for the inner loop
        if(rangeArr[row][col] == "")
          break;
        
        if(col == 0)//could make this part quicker later tbh
          temp = rangeArr[row][col];
        else
          temp = `${temp}|${rangeArr[row][col]}`;
      }
      
      result.push([temp]);
    }
    resolve(result);
  });
}
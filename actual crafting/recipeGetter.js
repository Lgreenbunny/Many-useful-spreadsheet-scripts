/*
  gets recipes and crafts them with the help of recipeTall yand recipeSetter
 */

async function recipeGetter() {//2d arr for debugging, add arg "range"
  //Range otherwise'
  const range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("crafting tally")
    .getRange("A3:F").getValues();


  /*console.log("recipeGetter's 2d arr, then the pushes to result:");
  console.log(range);*/
  
  const result = [];
  //return new Promise( (res)=>{
  for(var i = 0; i < range.length; i++){
    var recipeNum = range[i][0];
    if(recipeNum != "" && !isNaN(recipeNum)){//if there's a number in the first col
      var nameCol = range[i][1], ingredientArr = range[i][5].split("|"); 
      var temp = [];
      //format "temp" into the old recipeTally format, may change later on

      console.log(`name: ${nameCol}\ningredientArr\n${ingredientArr}`);
      
      //first row needs name & the recipe amount on the sides
      //doesn't need to check for i each time this wayy
      if(ingredientArr.length != 0){
        //console
        temp.push([nameCol, ...(ingredientArr[0].split(";")), Number(recipeNum)]);
      }

      for(var j = 1; j < ingredientArr.length; j++)
        temp.push(["", ...(ingredientArr[j].split(";")), ""]);

      //console.log(temp);
      result.push(...temp);//temp's a 2d arr
    }
  }
  console.log("result of recipeGetter:");
  console.log(result);

  //move the user to the right spreadsheet and range
  var tallyRes = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tally results");
  tallyRes.setActiveSelection("A1");


  //if there's nothing inside the result[] to tally, just print an error-handling "No recipes to tally"
  if(result.length == 0){
    const errorMessage = [[`No recipes to tally,`]
      ,[` please type some recipe numbers inside `]
      ,[`"Crafting tally"s first/A column.`]];
    tallyRes.getRange("D2:I").clearContent();
    const errorMessageRange = await rangeStarter("D", 2, errorMessage);
    await rangeTransfer(tallyRes, errorMessageRange, errorMessage);
    return ("Finished recipeGetter/crafting (ERROR)!");

  }

  //if there were entries to tally/convert
  //send data to setter for formatting
  const setterResult = await recipeTally(result)
    .then((e)=>recipeSetter(e));
  
  //calculating dimensions before transferring
  const leftFinal = await rangeStarter("D", 2, setterResult.left);
  const rightFinal = await rangeStarter("H", 2, setterResult.right);
  //[rowstart, colstart, rowEnd, colEnd]
  //clear area 
  tallyRes.getRange("D2:J").clearContent();

  //transferring
  await rangeTransfer(tallyRes, leftFinal, setterResult.left);
  await rangeTransfer(tallyRes, rightFinal, setterResult.right);

  return ("Finished recipeGetter/crafting!");
}

function backToTally(){
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("crafting tally")
    .setActiveSelection("A1");
}
    //res(result); 
  //});
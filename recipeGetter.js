/*
gets recipes listed inside the 
 */
async function reciGetTest(){
  /*const tested = await recipeGetter(//make sure you change recipeGetter's arg handling to A2:E
  [
    ["", "test1", "3", "egg", "fish; 3|egg; 1|tree; 2"],
    ["2", "test2", "3", "egg", "fish; 4|egg; 2"],
    ["", "test3", "3", "egg", "fish; 5|egg; 3|tree; 4"],
    ["18", "test4", "3", "egg", "fish; 6|egg; 4|test2; 5"],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
  ]);
  console.log(tested);
  const sentTally = await recipeTally(tested);
  console.log(sentTally);
  const formattedResult = await formatTally(sentTally);
  console.log("left then right since the ${} embedded strings messed up the array?");
  console.log(formattedResult.left);
  console.log(formattedResult.right);
  */
  //then send it to rangeTransfer in the real output
}
async function recipeGetter() {//2d arr for debugging, add arg "range"
  //Range otherwise'
  const range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("crafting tally")
    .getRange("A2:E").getValues();

  /*console.log("recipeGetter's 2d arr, then the pushes to result:");
  console.log(range);*/
  
  const result = [];
  //return new Promise( (res)=>{
  for(var i = 0; i < range.length; i++){
    if(range[i][0] != "" && !isNaN(range[i][0])){//if there's a number in the first col
      var nameCol = range[i][1], ingredientArr = range[i][4].split("|"); 
      var temp = [];
      //format "temp" into the old recipeTally format, may change later on

      console.log(`name: ${nameCol}\ningredientArr\n${ingredientArr}`);
      
      //first row needs name & the recipe amount on the sides
      //doesn't need to check for i each time this wayy
      if(ingredientArr.length != 0){
        //console
        temp.push([nameCol, ...(ingredientArr[0].split(";")), Number(range[i][0])]);
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

  //send data to the other parts of the script
  return await recipeTally(result)
    .then((e)=>recipeSetter(e))
    .then((e)=> {
      rangeTransfer(tallyRes,"D2:E", e.left);
      rangeTransfer(tallyRes,"H2:I", e.right);
  });
}

function backToTally(){
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("crafting tally")
    .setActiveSelection("A1");
}
    //res(result); 
  //});
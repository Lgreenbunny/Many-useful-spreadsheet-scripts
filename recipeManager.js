async function managerTest(){
  //from the stardew example sheett
  const result = await recipeManager(
    [
      ["atk +3, 5min", "", "roots platter", "1", "cave carrot", "1", "winter root", "1", "", ""],
      ["foraging +3, 5min", "", "survival burger", "1", "bread", "1", "cave carrot", "1", "eggplant", "1"],/*
      ["mining +3, magnetism +32, 5min", "", "miner's treat", "1", "cave carrot", "2", "sugar", "1", "milk", "1"],
      ["mining +2, 3.5min", "", "cranberry sauce", "1", "cranberries", "1", "sugar", "1", "", ""],
      ["foraging +2, 11min", "", "pancakes", "1", "wheat flour", "1", "egg", "1", "", ""],
      ["foraging +2, def +2, 8min", "", "autumn's bounty", "1", "yam", "1", "pumpkin", "1", "", ""],
      ["desert trader", "food, shop", "spicy eel", "1", "ruby", "1", "", "", "", ""],
      ["", "mine, shop", "mega bomb", "1", "iridium ore", "5", "", "", "", ""],
      ["", "mine, shop", "bomb", "1", "quartz", "5", "", "", "", ""],*/
      ["", "plant, shop", "hay", "3", "omni geode", "1", "", "", "", ""]
    ]
  );
  console.log(result);
}

async function recipeManager() {//2d arr for testing
  const recipeEntrySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("recipe entry");
  const targetSheetName = recipeEntrySheet.getRange("B1").getValue();

  const destinationEntrySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheetName);
  const arr = recipeEntrySheet.getRange("A3:Z").getValues();//starts at row 3

  const result = [];
  //for each row in recipeEntry
  for(var i = 0; i < arr.length; i++){
    //log the first columns in the "name, yield, notes " format 
    var notes = 0, name = 1, typeVar = 2, yieldVar = 3;
    result.push([arr[i][name], arr[i][typeVar], arr[i][yieldVar], arr[i][notes]]);
    
    //then loop through the list of ingredients, pushing each pair to the result row in a cell
    const ingredients = arr[i].slice(4);
    for(var j = 0; j < ingredients.length; j+=2){
      //should be divided by a "; "
      if(ingredients[j] != "" && ingredients[j+1] != ""){
        result[i].push(`${ingredients[j]}; ${ingredients[j+1]}`);
      }
    }
  }

  
  //after the loops are done, log the range into the game's sheet
  //find the last index that doesn't have an entry inside, then send the results to rangeStarter, then copy to the range starting from there
   var firstEmptyLine = 0;
   //looking at the first row of the destinationEntrySheet's values, check for blanks
   const destinationArr = destinationEntrySheet.getRange("A:A").getValues();
  for(var firstEmptyLine; firstEmptyLine < result.length; firstEmptyLine++){
    if(destinationArr[firstEmptyLine][0] == "")
      break;
  }
  //if it sees an index that's blank at index 3, that would be row 4
  firstEmptyLine++;
  
  //console.log(`firstEmptyLine: ${firstEmptyLine}
  //result:`);
  //console.log(result);
  const coords = await rangeStarter("A", firstEmptyLine, result);
  await rangeTransfer(destinationEntrySheet, coords, result); 
  /*return new Promise((resolve)=>{
    resolve(result)
  });*/
}

/*clears the entire recipe entry range with A2:Z
   potentially dd a message box asking to confirm*/
function recipeEntryClear(){}
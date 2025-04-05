const sheetOfSpread = "1dXG0ctJB3gTMjgVyaM49n2YuwEpcRwxIkHdGBpiy6Es";
/*async function craftTest() {//launches one of the functions below (in the future)
    return
}*/
  

async function reciStarterTest(){
  return await recipeStarter(SpreadsheetApp.openById(sheetOfSpread));
}


/*  return await recipeStarter(//stardew args
    [
        ["test1", "3", "egg", "fish; 3", "egg; 1", "tree; 2"],
        ["test2", "3", "egg", "fish; 4", "egg; 2", "tree; 3"],
        ["test3", "3", "egg", "fish; 5", "egg; 3", "tree; 4"],
        ["test4", "3", "egg", "fish; 6", "egg; 4", "tree; 5"]
    ]    
    )
    
    var temp = await (condenseIngredient(//remember to uncomment the const tally once you're done
    [
        ["fish; 3", "egg; 1", "tree; 2"],
        ["fish; 4", "egg; 2"],//2 entries only
        ["fish; 5", "egg; 3", "", "tree; 4"],//should have fish5|egg3 only
        ["fish; 6", "egg; 4", "tree; 5"]
    ]    
    ));
    console.log(temp);;

async function reciGetTest(){//the whole crafting part
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
    
    //then send it to rangeTransfer in the real output
}

function testTally(){
    recipeTally(
        [
        ["abeemination", "honey block", "5", ""],
        ["", "stinger", "1", ""],
        ["", "hive", "5", ""],
        ["", "bottled honey", "1", ""],
        ["non abeemonation", "abeemination", "2", "30"],
        ["", "blinkroot", "3", ""]
        ]
    );
        /*
        [
            ["healing potion", "mushroom", "2", 20],
            ["", "gel", "4", ""],
            ["", "bottle", "4", ""],
            ["", "glowing mushroom", "1", ""],
            ["mana potion", "lesser mana potion", "2", 20],
            ["", "glowing mushroom", "1", ""]
        ]
        
}

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
        ["", "mine, shop", "bomb", "1", "quartz", "5", "", "", "", ""],
        ["", "plant, shop", "hay", "3", "omni geode", "1", "", "", "", ""]
      ]
    );
    console.log(result);
  }
  
async function rangeStarterTest(){
    var test = await rangeStarter("a", 2, 
    [
      ["atk +3, 5min", "",  ""],
      ["", "mine, shop", "bomb", "1", "quartz", "5", ""],
      ["", "plant, shop", "hay", "3", "omni geode", "1", "", "", "", ""]//10 cols total, 3 rows total
    ]  //from a2, should be a2:j4 (row 2 col 1):(row 4 col 10)
  );
  console.log(test);
}


    */
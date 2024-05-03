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
    */
}

/*return value/global map documentation:
  //recipeMap: 
    key: (name of the recipe), 
    value: {
      ingredients: [{name, amount}], 
      recipeCount: (int)
    }

  //ingredientMap/startingSum: 
    key: ingredientName, 
    value: total

  recipeLoader: [{name, count}]
  recipeLooper: [{name, amount}]
  objectSummer: nothing
  finalSum: [[name of ingredient, amount used in all recipes]] (output to google sheets)
*/

const recipeMap = new Map();
//for the initial ingredients with no breaking-down
const startingSum = new Map();
//for all broken down ingredients
const ingredientMap = new Map();

async function recipeTally(range) {//[recipeName,	ingredientName,	amount, 	recipe count]
  //load all recipe names and ingredients into the recipeMap
  const recipeNames = await recipeLoader(range);

  //send each non-zero recipe entry to recipeLooper to tally the ingredients needed
  const loops = recipeNames.map((e)=> recipeLooper(e.name, e.count, 0));

  const looped = await Promise.all(loops);
    //THEN(promise) send the resulting arrays to objectsummer to compile all ingredients into the ingredients map
  await objectSummer(looped);
    //THEN(promise) send THAT array to finalSum to get the final result array

  return await finalSum();
}

/*puts all recipes in the map as [recipeName, {{(ingredient) name, amount}, recipeCount}]
  each time there's a new name in the first row, start a new entry/key for the map
*/
function recipeLoader(range){
  return new Promise((res)=>{
    //holds the array to fill in the map at the moment
    var currentFilledArr = [];
    //completely duplicate recipe found, skip the next set of ingredients until the next recipename's found
    var skipMode = false;

    var namesWithNumbers = [];
    for(var i = 0; i < range.length; i++){
      var recipeName = range[i][0];
      var recipeCount = ((range[i][3]) == ""? 0 : Number(range[i][3]))
      //if there's a new recipe name... if you need 2 differrent ways to make the same recipe, rename the recipes slightly for now
      if(recipeName != "" && undefined === recipeMap.get(recipeName)){
        skipMode = false;
        currentFilledArr = [];
        recipeMap.set(recipeName, 
          {ingredients: currentFilledArr, recipeCount: recipeCount});
        
        if(recipeCount != 0 && recipeCount != NaN) 
          namesWithNumbers.push({name: recipeName, count: recipeCount});
      }


      else if(recipeName != "" && undefined != recipeMap.get(recipeName)){
        skipMode = true;
        continue;
      }
      
      //adding ingredients may also happen on the row recipe's name is put in
      if(!skipMode && range[i][1] != "")
        currentFilledArr.push({name: range[i][1], amount: Number(range[i][2])})
    }
    res(namesWithNumbers);
  });
}

async function recipeLooper(key, count, recursionCount) {
  const resultObjArr = [];
  const ingredients = recipeMap.get(key).ingredients;
  var objTemp = {name: "", amount: 0};
  /*if an ingredient's name is found in the recipe map, 
    the function calls itself with the text after the * to find the actual amount of ingredients to multiply, 
    then multiplies that array of objects
    (crafted things that require other crafted things, like nested recipes)
  */
  for(var i = 0; i < ingredients.length; i++){
    var name = ingredients[i].name;
    var amount = ingredients[i].amount;

    //add the amount of ingredients to the sum if this is one of the starting calls
    if(recursionCount == 0)
      await mapTotaler(startingSum, name, amount * count);
    

    /*if the ingredient's found in the recipe table,recursionn
      send the current ingredient name and the current ingredient amount for the recipe as parameters

      also stops the recursion process if this chain hits 10
    */
    if(!(recipeMap.get(name) === undefined) && recursionCount < 10){
      //an array of objects (or a blank one)
      objTemp = await recipeLooper(name, amount, (1 + recursionCount));
      if(objTemp.length > 0){
        objTemp.forEach((e) => e.amount*= count);
      }
      resultObjArr.push(...objTemp);
    }

    else{
      objTemp = {name: name, amount: (amount * count)};
      resultObjArr.push(objTemp);
    }
  }

  return new Promise((res)=> {
    res(resultObjArr);
  });
}

function mapTotaler(theMap, name, amount){
  return new Promise((res)=>{
    var mapVal = theMap.get(name);
    if(mapVal === undefined)
      theMap.set(name, amount);
    else
      theMap.set(name, amount + mapVal); 
    res("");
  });
}

/*finds the information in the recipe map for the recipe name given
  if it wasn't found, return an empty array. If this function receives an empty array, also return an empty array.
  after all this happens, the recipeTally main script can call objectSummer to sum all the object values found in the array
*/  
/*if it successfully finds a recipe, it should multiply the found ingreedient list based on the numbercount of recipes 
  you're making and return that list
  the function's data type should be an array of objects  (with multiplied values) that it returns later
*/
//sums all the ingredients in each recipeLooper call (arr of objects), then puts them in the ingredient map
async function objectSummer(multipleObjArr) {//2d arr, [[{name, amount}]]
  //putting all objects in the same array
  const arr = [], waiting = [];
  multipleObjArr.map((e)=> arr.push(...e));
  arr.forEach((e)=> waiting.push(mapTotaler(ingredientMap, e.name, e.amount)));

  await Promise.all(waiting);
  return new Promise((res)=> {
    res("");
  });
}


//after the recipeLooper's done, it should make a formatted list of all the ingredients totalled together 
function finalSum() {
  return new Promise((res)=>{
    const result = [["final ingredient make up:"]];
    const startIterator = startingSum.entries();
    for(const e of startIterator)
      result.push([e[0], e[1]]);
    
    result.push([""]);
    result.push(["broken down:"]);
    const mapIterator = ingredientMap.entries();
    for(const e of mapIterator)
      result.push([e[0], e[1]]);
    
    res(result);
  });
}

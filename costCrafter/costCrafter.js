/*
	this function's in every cell under "base cost" in the "raw FOOD recipes" sheet
	finds the total cost of the raw ingredients inside the ingredient row [binary search], and, if necessary, finds other 
		ingredients to craft to get a specific, craftable ingredient (like bread may be used as an ingredient, and is 
		made up of ingredients)
	then it returns both the cost and the crafting tree to get to the cost in separate cells horizontally
	this function may be used in the future for the main crafting calculator for cost-calculating things
	
	the ingredientList'range should end at the "zzzEND" cell for now, but later on you can make a flexible range or something
*/

async function costCrafter(recipeCell, ingredientList, recipeList, limit){
	const temp = recipeCell.split(", ");
	const ingredients = [];
  var markiplier = (arguments.length == 5? arguments[4] : 1);
	const prom = [];

	/*
		breaks down the ingredients inside the recipe cell into the form
		[{amount, name}, {amount, name}, ...] 
    from the input "(# )ingredient, ..." where (# ) are numbers, like "3 " if there are any.
    Immediately after each group of "(# )ingredient", the amounts are multiplied and sent to be processed further
	*/
	for(const e of temp){
		//take the first word in the string group and converts to a number if possible
		var allWords = e.split(" ");
		var firstNumTest = Number.parseInt(allWords[0], 10);

    //for each ingredient, search through the sorted list of ingredients and get the cost with ingredientSearcher(name)
    //this function will be called back recursively to calculate a different recipe
    //multipliers and such are multiplied here per ingredient as well, and are passed on to the next function
    var tempObj = 0;
		if(Number.isNaN(firstNumTest)){
      tempObj = {amount: markiplier, name: e}
      ingredients.push(tempObj);
    }
    else{
      tempObj = {amount: firstNumTest*markiplier, name: allWords.slice(1).join(" ")}
      ingredients.push(tempObj);
    }
    
    prom.push(ingredientSearcher(tempObj, ingredientList, recipeList, limit, tempObj.amount));
	}
	
	/*const prom = ingredients.map((e)=>ingredientSearcher(
    e, ingredientList, recipeList, limit, markiplier
  ));*/

	return await Promise.all(prom).then((arr)=>{
		//total all the costs in the right format, with the crafting trees
		const result = [0, ""];
		for(const e of arr){
			result[0] += e[0];
			result[1] = result[1].concat(", ", e[1]);
		}
		result[1] = result[1].slice(2); // remove the first comma
		if(limit == 10)// if this function is the original function and not being recursive, add the [] for a google sheet row, otherwise leave it plain for ingredientSearcher
			return [result];
		else
			return result;
	});
}

/*
	ingredientList is 3 columns, with the lasst column being the "craftable" one
	recipeList is also 3 columns, Dish, Price, Ingredients
	this is used on every group of ingredient words
  multiplier = markiplier fr
*/
async function ingredientSearcher(obj, ingredientList, recipeList, limit, markiplier){
	const result = [0, "("];//return [cost, craftTree]
	
	//[name, cost, craftable] return
	const ingredientInfo = await theBinary(obj.name, ingredientList);
		
	/*
		if the ingredient has a TRUE in the craftable 3rd column/2nd index, recursively search for the ingredients that make up
		said ingredient, up to a limit (decreases each time, when it hits 0 there's no more recursion
	*/
	if(ingredientInfo[2]){
		//find the recipe cell using the current object's name, there's a sorted version in the FOOD ingredients sheet
		//then it'll return the 3 cells involved, and we just need the 3rd one (recipe cell) to do another loop of recursion

    //[[name, sells for, ingredients]] as usual, sends the list of ingredients to be sorted and waits for the result     
    const tempIngredients = (await theBinary(obj.name, recipeList))[2];

		const recursed = await costCrafter(
			tempIngredients, ingredientList, recipeList, limit-1, markiplier); // will return [cost, craftTree] as well
			
		result[0] += recursed[0];//adding up older results
		result[1] = result[1].concat(obj.amount, " x ", obj.name, " ", recursed[1], ")");
	}
	else{
		result[0] += obj.amount * ingredientInfo[1];//true cost at the end of the recursion tree
		result[1] = result[1].concat(obj.amount, " x ", ingredientInfo[0], ")");
	}
	
	return new Promise((resolve)=>{
		resolve(result);
	});
}


//returns [name, cost, craftable]
function theBinary(key, arr){
	return new Promise((resolve)=>{
		var topBound = 0, bottomBound = arr.length-1;
		var index = Math.floor(arr.length/2);
		
		//makes the new index in the middle of the 2 bounds each time
		//if it's at 2 and 9, should take the point closest to 2+(9-2)/2, top of the range + the distance to the middle of the 2
		for(index; index > topBound && index < bottomBound; 
			index = Math.floor((topBound+(bottomBound - topBound)/2))){
				
			//compare the key to the current index
			var test = key.localeCompare(arr[index][0]);
			
			//if it's a matchhhhh break the loop and return the row	
			if(test == 0)
				break;
			//if the key's lower/earlier than the index, reduce bottom bound, otherwise increase top bound
			if(test<0)
				bottomBound = index;
			else 
				topBound = index;
		}
	
		resolve(arr[index]);
	});
}
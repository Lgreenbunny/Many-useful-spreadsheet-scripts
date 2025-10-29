/*
	this function's in every cell under "base cost" in the "raw FOOD recipes" sheet
	finds the total cost of the raw ingredients inside the ingredient row [binary search], and, if necessary, finds other 
		ingredients to craft to get a specific, craftable ingredient (like bread may be used as an ingredient, and is 
		made up of ingredients)
	then it returns both the cost and the crafting tree to get to the cost in separate cells horizontally
	this function may be used in the future for the main crafting calculator for cost-calculating things
	
	the ingredientList'range should end at the "zzzEND" cell for now, but later on you can make a flexible range or something
*/

async function costCrafter(recipeCell, ingredientList, recipeList, recipeYield, limit){
	const temp = recipeCell.split(", ");
	const ingredients = [];

  //if nothing there or 0, falsy, logical OR assignment, was going to use ||= but compiler didnt like
  recipeYield = (recipeYield ? recipeYield : 1); 
  var markiplier = (arguments.length == 6? 
    (Math.ceil(arguments[5]/recipeYield)) : 1);
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
	
	//[name, sells for, bought for, craftable], returns ingredient row info
	const ingredientInfo = await theBinary(obj.name, ingredientList);
		
	//craftable recipe for this ingredient found, recurses up to a limit
	//finds the recipe cell and yield using the current object's name before more recursion
	
	if(ingredientInfo[3]){
		//[[name, sells for, ingredients, yield]], the spiral of code calling commences here     
		const retrievedRecipe = await theBinary(obj.name, recipeList);
		const recipeIngredients = retrievedRecipe[2];
		const recipeYield = (retrievedRecipe[3]? Number(retrievedRecipe[3]) : 1);//blank cell "" is falsy
		
		//computing the new multiplier... set the multiplier to the highest factor of the yield as needed
		//like if the yield's 4 for the recipe buy you need 14, would need 4 of the recipe
		//ceiling(14/4) = ceiling(3.5) = 4
		var adjustedMarkiplier = Math.ceil(markiplier/recipeYield);
			
		// will return [cost, craftTree] as well
		const recursed = await costCrafter(
			recipeIngredients, ingredientList, recipeList, limit-1, adjustedMarkiplier); 
			
		result[0] += recursed[0];//adding up older results
		result[1] = result[1].concat(recipeYield*adjustedMarkiplier, " x ", obj.name, " ", recursed[1], ")");
	}

  //base ingredients are sold or bought for if it's typed in
	else{
		result[0] -= obj.amount * ingredientInfo[2];//"bought for" ingredients
    /*
      potentially put the ingredient "sells for" here, to see if it's worth crafting for the recipe, 
      but i'd want to check every ingredient's sale price down the line for that to see if any sell for more than the recipe
      so I'd put it before both areas, or make a function for that area before the conditions
    */
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
		for(index; index >= topBound && index <= bottomBound; index = Math.floor((topBound+(bottomBound - topBound)/2))){
				
			//compare the key to the current index
			var test = key.localeCompare(arr[index][0]);
			
			//if it's a matchhhhh break the loop and return the row	
			if(test == 0)
				break;

			//if the key's lower/earlier than the index, reduce bottom bound 
			if(test<0){
				bottomBound = index;

        if(key.localeCompare(arr[topBound][0])== 0){//and inspect the top bound
          index = topBound;
          break;
        }
        else
          topBound++;
      }

			else if(test>0){//vice versa
				topBound = index;

        if(key.localeCompare(arr[bottomBound][0])== 0){//and inspect the top bound
          index = bottomBound;
          break;
        }
        else
          bottomBound--;
      }
		}
	
		resolve(arr[index]);
	});
}
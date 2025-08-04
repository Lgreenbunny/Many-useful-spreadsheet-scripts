async function crafterLauncher(){
	const spreadSheetMistria = SpreadsheetApp.openById("1NMgROzO0hep5Ek80KJGGWOTvZYdKEBdT5VKj9znpvx4");
	const recipeSheet = spreadSheetMistria.getSheetByName("raw FOOD recipes");
	const ingredientSheet = spreadSheetMistria.getSheetByName("FOOD ingredients");
	
	//get ranges (most are indirects)
	//
	const ingredientCostArr = ingredientSheet.getRange(
		ingredientSheet.getRange("K2").getValue()
	).getValues();
	
	//
	const recipeSortedArr = ingredientSheet.getRange(
		ingredientSheet.getRange("K3").getValue()
	).getValues();
	
	const recipeMakeupList = recipeSheet.getRange("E2:E").getValues();
	
	//loop through each VALID recipe cell and wait for all promised calculations to finish
	//it returns [[cell, cell]] normally
	const promLaunches = [];
	for(var i = 0; i < recipeMakeupList.length; i++){
		var cell = recipeMakeupList[i][0];
		if(cell == "" || cell == "-")
			promLaunches.push([["", ""]]);//to match the format of the crafterLauncher results, to be unshelled later
		
		else{
			const miniResult = costCrafter(
				cell,
				ingredientCostArr,
				recipeSortedArr,
				10
			);
			promLaunches.push(miniResult);
		}
	}
	
	await Promise.all(promLaunches).then((result)=>{
		const unshelledResult = result.map((e)=> e[0]);
		
		//the row starts at 2, so the end row would be 2 + length-1 (f2:g3 from length 2 for example)
		var length = unshelledResult.length;
		recipeSheet.getRange("F2:G"	+ (2+length-1)).setValues(unshelledResult);
		
		//return unshelledResult;
	});
	console.log("Successfully launched the crafter.");
}	
	/* 
	costCrafter(recipeCell, ingredientList, recipeList, limit){
	*/

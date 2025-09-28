function craftyTest(){
	const spreadSheetBase = SpreadsheetApp.openById("1PTUNqPzjb5RGqwNYxr6b94SCrZfSFKgSNVujx_B77c0");
	const recipeSearchSheet = spreadSheetBase.getSheetByName("search and results");
	const ingredientSheet = spreadSheetBase.getSheetByName("ingredients");

	costCrafter(
		recipeSearchSheet.getRange("A4").getValue(), 

		ingredientSheet.getRange(
      ingredientSheet.getRange("Y1").getValues()).getValues(), 

		ingredientSheet.getRange(
      ingredientSheet.getRange("W1").getValues()).getValues(), 

		10,

    recipeSearchSheet.getRange("B4").getValue()
	);
}
//costCrafter(recipeCell, ingredientList, recipeList, limit, multiplier){
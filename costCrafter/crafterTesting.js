function craftyTest(){
	const spreadSheetBase = SpreadsheetApp.openById("1PTUNqPzjb5RGqwNYxr6b94SCrZfSFKgSNVujx_B77c0");
	const recipeSearchSheet = spreadSheetBase.getSheetByName("search and results");
	const ingredientSheet = spreadSheetBase.getSheetByName("ingredients");

	costCrafter(
		recipeSearchSheet.getRange("A4").getValue(), 

		ingredientSheet.getRange(
      ingredientSheet.getRange("Z1").getValues()).getValues(), 

		ingredientSheet.getRange(
      ingredientSheet.getRange("X1").getValues()).getValues(), 

		recipeSearchSheet.getRange("B4").getValue(), 

		10,

    recipeSearchSheet.getRange("C4").getValue()
	);
}
/*
  costCrafter(recipeCell, ingredientList, recipeList, 
  recipeYield, limit, [multiplier])
 */
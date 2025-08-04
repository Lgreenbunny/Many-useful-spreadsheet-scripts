function craftyTest(){
	const spreadSheetMistria = SpreadsheetApp.openById("1NMgROzO0hep5Ek80KJGGWOTvZYdKEBdT5VKj9znpvx4");
	const recipeSheet = spreadSheetMistria.getSheetByName("raw FOOD recipes");
	const ingredientSheet = spreadSheetMistria.getSheetByName("FOOD ingredients");
  //grilled cheese recipe E59, bread 8, both ranges for the ingredient sheet 
	costCrafter(
		recipeSheet.getRange("E8").getValue(), 
		ingredientSheet.getRange(
      ingredientSheet.getRange("K2").getValues()).getValues(), 
		ingredientSheet.getRange(
      ingredientSheet.getRange("K3").getValues()).getValues(), 
		10
    //,5
	);
}
//costCrafter(recipeCell, ingredientList, recipeList, limit){
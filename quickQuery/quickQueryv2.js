/**
 * Helps you make a query with the QUERY built in formula. 
 * Will include some regex functionality later, too. (Under construction)
 * for "searchFields" positions, type them as "arr1, arr2, ..."
 * @param {string} comparisons The query string with arr(#) variable placeholders
 * @param {Object[]} searchFields The search field row or cell
 * @return The processed "WHERE" query string
 * @customfunction
*/
//https://jsdoc.app/tags-param
//make sure the query has a header row for this, also maybe add a way to replace "arr" with something else if someone wants to idk
async function quickQuery(comparisons, searchFields){
	/*
		for every "arr#" in comparisons, replace all matching instances with the searachfield involved
		if the searchfield is blank, skip that searchfield
	*/

  if(!Array.isArray(searchFields))
    searchFields = [[searchFields]];

	var finalString = comparisons;
	for(var i = 0; i < searchFields[0].length; i++){
		if(searchFields[0][i] == "") 
			continue;
		
		finalString = finalString.replaceAll(
			RegExp(`arr${i+1}`, "gi"), 
			searchFields[0][i]
		);
	}
	
	return finalString;
}

//everybody wants to rule the world
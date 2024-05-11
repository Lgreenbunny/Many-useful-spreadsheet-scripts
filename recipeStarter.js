/* inside the raw entry recipes
given a list of names + a list of values inside recipeTally, it puts the 
  correct values to the right of the recipe names inside the raw entries
  it looks for exact matches
  this function will be put on each 4th column with each group of 5 columns near the top with the header
 */
const recipeNumbers = new Map();
function recipeSetter(range, twoColInput) {
  //load twoColInput into the map
  for(var i = 0; i < twoColInput.length; i++){
    if(twoColInput[i][0] != "")
    recipeNumbers.set(twoColInput[i][0], twoColInput[i][1]);
  }

  const result = [];
  //going down range, check the first row for names
  for(var i = 0; i < range.length; i++){
    var temp = recipeNumbers.get(range[i][0]);

    //if there's nothing there or no match, push a blank "" into the results col
    //otherwise, push the number value found in the map for the recipe name found
    result.push(temp === undefined? [""] : [temp]) ;
  }

  return result;
}
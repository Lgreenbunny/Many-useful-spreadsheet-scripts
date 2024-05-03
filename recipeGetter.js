/*inside the recipe tally sheet
  first it gets the header for each column
    then it sorts the list of recipe names, and outputs the header then
      the recipe names in a sorted order. 
    After that, it puts the 2nd group of recipes+header's results below that one, etc.
    the result's a column of headers & sorted recipes so the user can easily
      write the amounts of crafted recipes they want on the right of the output
 */
function reciGetTest(){
  recipeGetter([
    ["spheres/pals", "", "", "", "", "storage", "", "", "", "", "food/medicine/mats", "", "", ""],
    ["egg incubator", "paldium fragment", "10", "", "", "wooden chest", "wood", "15", "", "", "medieveal med", "wood", "30", ""],
    ["", "cloth", "5", "", "", "", "stone", "5", "", "", "", "*nail", "5", ""],
    ["", "stone", "30", "", "", "cooler box/fridge", "ingot", "20", "", "", "", "paldium frag", "10", ""]
  ]);
}
function recipeGetter(range) {
  const result = [];
  const holding = [];//will be 2d

  //USED TO go sideways throughout the entire range but it created a circular dependency in a way
  //check for recipe names down multiple rows
  for(var i = 0; i < range.length; i++){
    //goes sideways to check for recipes, puts entries inside holding in a transposed way
    //like the column's being put inside like a row
    for(var j = 0; j < range[i].length; j++){
      if(holding.length <= j)
        holding.push([]);

      if(range[i][j] != "")
        holding[j].push(range[i][j]);
    }
  }
  
  //format the holding array into the results array, sorting the non-header part of the array first
  for(var i = 0; i < holding.length; i++){
    //separator
    if(i > 0)
      result.push(""); 

    var temp = holding[i].slice(1);

    temp.sort();

    result.push(holding[i][0]);
    temp.forEach((e)=> {
      if(e != "" && e != undefined)
        result.push(e);
    });
  }
  //add each to result

  return result;
}

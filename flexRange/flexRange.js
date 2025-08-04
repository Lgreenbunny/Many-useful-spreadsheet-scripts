/* counts the distance between the last filled cell and the top of the range
using just one column. Later on, the code may return a cell range, too.
maybe i could make a horizontal version later as well
*/
async function flexRange(range, isFilled) {
  //IF all of the data's filled until the bottom, use binary search to find the base area

  //otherwise
  return await regularSearch(range);  
}

//recursive binary search to find the lowest entry in the range, starting from the bottom
  /*each one of these functions checks the entries above and below this index
    if the index before/-1/above this one had text...
      -but this one doesn't, return the last entry
      -and this one does have an entry, go down halfway in the rows
    
    if the index after/+1/below this didn't have text...
      -and this one does, mark THIS one as found and return this entry
      -and this one also doesnt, go up halfway in the rows
    
    if it reaches the top or bottom, return 0/length
  */
async function bSearch(index, upperRange, lowerRange){
} 

//starting from the bottom of the column, check how far the lowest range is one at a time
function regularSearch(range){
  return new Promise((resolve) => {
    if(range.length == 0)
      resolve(0);

    var i = range.length-1;
    while(i >= 0){
      if(range[i][0] != null && range[i][0].length > 0)
        break;
      i--;
    }
    resolve(i);
  });
} 
function testFlex(){
  flexibleArrange([[2],[2],[3, 3]]);
  flexibleArrange([[2],[2],[3, 3]], 1);
}

//given a range , puts all the contents into either one column or row
//if there's a 2nd argument, it maked a column of results, otherwise it defaults to row.
//ignores empty/null cells
//goes down each row from left to right, then goes down to the next row, so it's like a reading format.
async function flexibleArrange(inputRange) {
  result = [];

  if(arguments.length > 1){
    return await new Promise((resolve) => {
      for(var i = 0; i < inputRange.length; i++){
        for(var j = 0; j < inputRange[i].length; j++){
          if(inputRange[i][j] != "")//inputRange[i][j] != null && inputRange[i][j].length > 0
            result.push([inputRange[i][j]]);
        }
      }
      resolve(result);
    });
  }
  else{
    return await new Promise((resolve) => {
      for(var i = 0; i < inputRange.length; i++){
        for(var j = 0; j < inputRange[i].length; j++){
          if(inputRange[i][j] != "")//inputRange[i][j] != null && inputRange[i][j].length > 0
            result.push(inputRange[i][j]);
        }
      }
      resolve([result]);
    });
    
  }
}

function testExpand(){
  attributeExpand([["hii, what's up?, e", "nya"], ["bark bark, bark", "hi hia hyia", "b"]]);
}

var delimiter = ", ";
async function attributeExpand(range) {//, delimiter combinations
  //for each row in the given range, send it to be processed by the rowManager

  const toProcess = [];
  range.forEach((row) => toProcess.push(rowManager(row)));

  //put all the rowManagers into one big block 2d array after waiting for the first rows
  return await Promise.all(toProcess)
    .then((resultArray) => rowCombiner(resultArray));
}
//btw, finish coding rowManager's map function


async function rowManager(row){//cell 1, 2, 3...
  //for each cell in the row, including blank ones, send it to be processed by the cellManager
  //very creative names
  const cellPromises = [];
  row.forEach((cell) => cellPromises.push(cellManager(cell)));


  //wait for all the cells of the row to finish, then return a 2d array with special formatting
  return await Promise.all(cellPromises).then((arrBlock) => {
    const blanks = [];
    const result = [];

    //every time i increases, add more blanks
    for(var i = 0; i < arrBlock.length; i++){
      //push each text string e that was found in the cell (now arr[i]) from an array of promis
      //(2d array arrBlock)[arr with strings]
      
      //result.push(blanks.concat([arrBlock[i]]));

      //console.log(arrBlock);
      //console.log(arrBlock[i]);
      //arr w/strings.forEach
      arrBlock[i].forEach((e) => result.push(blanks.concat([e])));
      
      //blanks should have blank spaces pushed to it everytime i increases, like push("");
      blanks.push("");
    }

    return result;

  });

  //each additional row after the first row has a blank space/index placed before it to add indentation





  /*maybe make this an option, or let the user specify "cell" or a different string to constantly add to the first cell
  like 
  a, 
  -a, 
  --a
  instead of using the cell gaps as indents, just 1 string cell*/
}

function cellManager(cell){
  //attempt to split the cell using the delimiter, then return the result as a Promise
  return new Promise((resolve)=>{
    const splitted = cell.split(delimiter);
    console.log(splitted);
    resolve(splitted);
  });
}

//just take each 2d array within arrayBlocks and summarize them into one 2d array, arrayBlocks should be a 3d
//maybe make this more efficient so I don't need a 3d, probably later

//no need to change contents, just array positioning
async function rowCombiner(arrayBlocks){

  return new Promise((resolve) => {
    //put all the rowManagers into one big block 2d array
    const giganticArray = [];

    //each individual rowManager, 2d
    for(var i = 0; i < arrayBlocks.length; i++){
      //(rowmanager).(each one inside it)
      arrayBlocks[i].forEach((e) => giganticArray.push(e));
    }

    resolve(giganticArray);

  });
}
/*
could have the script take a range and numbers			
the numbers can stand for the columns that need thier cells to be split up and put in their own rows in the result			
	like addresses might not need 3 rows, but multiple times might		
the numbers should be a stringg and separated by spaces			
there could also be a delimiter beside each number just in case different columns need different splitting things			
	otherwise it should default to commas		
for each cell in the row, there should be at least one row dedicated to it			
	as it goes down the row, the starting column of the results should increase, like how I indent these notes smh		
		and if it's split	
		it should be listed	
		like this	
			then onto the next column until all the rows are done
			
may be able to combine each row after formatting andsplitting the cellss inside a Promise.All().then			
	the results themselves should be in a 2d array, so idk if it's possible to combine a 2d array regularly		
		gotta have the 2d to keep the formatting, or return an array and make an object/separate array with indentations, but that seems like more work	
	might need to do a forEach or different loop
*/
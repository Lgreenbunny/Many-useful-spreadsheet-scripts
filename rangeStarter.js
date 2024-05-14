/**/async function starterTest(){
  var test = await rangeStarter("a", 2, 
    [
      ["atk +3, 5min", "",  ""],
      ["", "mine, shop", "bomb", "1", "quartz", "5", ""],
      ["", "plant, shop", "hay", "3", "omni geode", "1", "", "", "", ""]//10 cols total, 3 rows total
    ]  //from a2, should be a2:j4 (row 2 col 1):(row 4 col 10)
  );
  console.log(test);
}

//finds the column bounds for a given array & a starting cell, from A-Z only
function rangeStarter(startColChar, rowStart, arr) {
  return new Promise((resolve)=>{
    //find the widest part of the array, initialize at 0 so it doesn't use part of the array at first
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    const colEnd = arr.reduce( //colEnd = width
      (theMax, theRow)=> Math.max(theMax, theRow.length), 0
    );

    //https://stackoverflow.com/a/12504061
    /*first compare the char to the char a, then turn that into the column number
      (these scripts wont be starting the setValue() past Z or AA, so this should be fine)

      normally it's getRange(row, column, numRows, numColumns)
      so if it starts at row 3 and ends at row 4, that's 2 rows, or just the length of the arr
    */
    let temp = "" + startColChar.toLowerCase();

    let colStart = temp.charCodeAt(0) - "a".charCodeAt(0)+1;

    let rowEnd = arr.length;

    //if it' 1 width (a literal column) and the column's a, it shouldnt goto a:b, so -1 the width
    //if the row's a 2 and the array's 2 long, it should fill up rows 2 and 3, 2+length-1 
    //resolve(`${startColChar}${rowStart}:${endColChar}${arr.length+rowStart-1}`);

    /*resolve(`for ${startColChar}${rowStart}
    cell at row ${rowStart}, col ${colStart}\tends at row ${rowEnd} col ${colEnd}`);*/

    resolve([rowStart, colStart, rowEnd, colEnd]);//can be easily spread into rangeTransfer
  });
}

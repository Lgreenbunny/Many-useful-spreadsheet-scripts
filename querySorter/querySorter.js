function testQuerySort(){
  /*querySorter("A B C D E F G H I J K L M N O P Q R", 
    [["", "", "", "", "", "", "", "4", "", "", "", "", "", "", "", "", "", ""]]);*/
  querySorter("A", [["40", ""]]);
}

  //split up the alphabet cell into an array
  //send each full cell to sortHandler with the respective letter
  /*when the object array returns, sort, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    there's a compare function you can usee with it
    there's also a way to sorta return the sorted contents of a Map, but the compare function shoulddddddddd be simple. 
      https://stackoverflow.com/a/31159284 the map solution, though. */

const wordThere = new RegExp(/.*(a|d)|(asc|desc)$/);
//this DOES NOT work if you suround it with "", at least with RegExp.
const numThere = new RegExp(/.*\d+$/);

//make sure all the text is plain text for now, no numbers
async function querySorter(colLetterCell, sortingRow) { // range of cells to sort + the order where you sort them, "A B C ..."
  /*first check the cell for the patterns, and if it does send the cell to be turned into an object with sortHandler*/
  const prom = [], letters = colLetterCell.split(" ");
  var num = false, word = false;

  for(var i = 0; i < sortingRow[0].length; i++){
    num = numThere.test(sortingRow[0][i]);
    word = wordThere.test(sortingRow[0][i]);
    if(num || word)
      prom.push(sortHandler(sortingRow[0][i], letters[i], word, num));
  }

  //after that's done, sort the array by the priority number with arrSorterSort and return the results
  return await Promise.all(prom).then((completeProm)=>{
    completeProm.sort(arrSorterSort);
    const arr = completeProm.map((e)=> e.text);
    return arr.join(", ");
  });
}

function sortHandler(cell, colLetter, wordFound, numberFound){ //returns {order, text}
  return new Promise((resolve)=>{
    //split up the cell contents by spaces and fill the result object based on which search it matched
    /*check the array's values, if there's 2 entries assign things normally, but if there's only 1 entry, put the 
      1 entry inside the variable based on what was foudn earlier (wordFound or numberFound)
      */
    //variables with defaults set
    var orderVal = 500, textVal = colLetter + " asc";
    const split = cell.split(" ");

    /*if asc/desc/a/d were found earlier (wordFound) put the column letter and the text
      if the number was found earlier, set the number as the order */
    if(split.length == 2){
      orderVal = Number(split[0]);

      if(split[1].length == 1)
        textVal = colLetter + " " + split[1].replace("a", "asc").replace("d", "desc");
      else
        textVal = colLetter + " " + split[1];
    }

    else{
      if(wordFound){
        if(split[0].length == 1)
          textVal = colLetter + " " + split[0].replace("a", "asc").replace("d", "desc");

        else
          textVal = colLetter + " " + split[0];
      }

      else if(numberFound)
        orderVal = split[0];
    }

    resolve({order: orderVal, text: textVal});
  });
}

//comparing function for arr.sort()
function arrSorterSort(a, b){
  return a.order - b.order;
}

// can put an underscore in the name like name_() to let other people usign the code know to NOT use it, it's just a naming convention in javascript and it doesn't control anything.

//apps script only lets you hide things where there's indents, also requires at least 1 indent for the block comments
async function test(){
  //https://stackoverflow.com/questions/48867655/get-sheet-by-name
  //https://stackoverflow.com/questions/20288351/debugging-a-custom-function-in-google-apps-script

  /* don't await in a console log, it doesn't like that
    quickQueryMod("bread wonder", "B");
    quickQueryMod("ch", "B");
    quickQueryMod("cheese e", "B");
    quickQueryMod("cheese|ec", "B");
    quickQueryMod("cheese|ec ac", "B");
    quickQueryMod("cheese|\"ec ac\"", "B");
    quickQueryMod("ch(eese|ec) \"ac\"", "B");
  */
  /*console.log("test was able to start running.");
    var temp = await parseCheck("eeee\" eme\" toodl\"me\"\"hi", "B").then(
      (contents)=>{
        console.log(contents);
        return contents;
      });
    return temp;*/

  console.log("test was able to start running.");

  const promises = [];
  /*const tests = [
    "cl\"egg\"e\"",
    "aaa\"bbb\"\"c\"\"ddd\"e"
  ];
    //"\"eeeeee\"rm\""*/
  const tests = ["(cuddle|egg)|(fish egg)"];
  //const tests = ["(egg)"];
  for(var i = 0; i < tests.length; i++){
    promises.push(quickQuery(tests[i], "B"));
  }
  return await Promise.allSettled(promises).then(
    (results) => {
      var str = results.join(";\t");

      //gives multiple [Object object]'s here, but when it's used in a google sheet it's completely fine...
      //why...
      console.log("back inside test with: %s,\nunjoined looks like %s", str, results[0]);
      return str;
    }
  );

  //H9-11 are the test things


  //return temp;

  //var temp = await parseCheck("\"me\"\"hi", "B");//testing leftover quotation handling
  //quickQueryMod("che(eeee) (bbbbb \"aaaa aaa\")", "B");
  //maybe test multiple columns later
  //code debugs other functions fine, but not the "test" function, so I can't feed in anything
  
}

  /*there couldddd be a function that makes 1-3 of the promises each time, before the string's divided and sent to parseCheck again
    since making those promises normally happen in every function, and it'll reduce redundancy
      but idk if that's necessary
    //creates promises for the 2 strings then waits on them
    //normally received from one of the symbol parsing functions and sent to parseCheck again
    async function splitPromise(){}
  */  


//main functionn
//loop explanation/things:
/*determine the structure for the query and send parts to be constructed based on filters(A, B, C LIKE) 
  and spaces (ANDs withink a filter, and connecting filters)

  if the current filter has spaces, put it in division mode
    if the input's supposed to contain literal strings, maybe make a system for 
    double quotes"" as literals, and everything else becomes ANDs

  later if more conditional words are needed, they can be added by changing some of the logic here
    for now it only connexts the different search fields with "and"
    also, only adds the conditional prefixes after the first valid filter's put in the promise array
*/

async function quickQuery(filterCats, colLetterText){
  var conditional = null;
  const results = [];
  const colNums = colLetterText.split(" ");
  
  //single query & column number cells
  if(!Array.isArray(filterCats)){
    if(filterCats.length >= 1 && colNums.length >= 1)
      return "" + await concatQuery(filterCats, colNums, null);

    else
      return "";
  }
  
  //multiple columns of filters & columns
  for(var i = 0; i < filterCats[0].length; i++){ 
    var temp = filterCats[0][i];

    //console.log("testing %s...", temp);
    if(temp.length < 1)
      continue;

    //send each category to be checked for special symbols, and handles them accordingly
    results.push(concatQuery(temp, colNums[i], conditional));

    /*if(conditional == null)
      conditional = "and ";*/
  }

  //concat the groups of query info into a string 
  return await Promise.all(results).then((resultingArr) => {
    //the whole array should be formatted to be cleanly joined without anything between them IF there's something there
    if(resultingArr.length == 0)
      return "";
    var temp = "(" + resultingArr.join(") and (") + ")";
    console.log("combining all the filter strings here: %s", temp);
    return temp;
  });
}


/* if useAnd, puts "and" in the front
  checks if there's special character to do different operations with, and sends them to differtent functions to handle them.
    After that, it joins them all, and adds any operator prefixes (conditional var)  
    when a ( is seen, it should find the next ) and make a substring of the contents in between the two symbols. 
  For ""'s, don't break it up at all, return a substring.
    the functions that do these could also await other function handlers to handle the contents inside the ""/()'s
    |'s,
  spaces should just be "and"s
  attaches the "colLetter like (filter)"  
*/

//the comment text above may be outdated, will re-read later

async function concatQuery(filter, letter, conditional){
  /*go through the text with parcheCheck initially, then after awaiting the text
    */
  return await parseCheck(filter, letter).then((result)=>{
    console.log("inside concatQuery with %s\nresult is this: %s", filter, result);
    var temp = "";
    
    //combining filter groups if the conditional's set
    if(conditional != null)
      temp = temp + conditional;
    
    //IF there's no bracket at the start of the result, add a placeholder
    if(result.charAt(0) != '(')
      result = "PLACEHOLDER" + result;

    /*change all "PLACEHOLDER"s to "LETTER like/contains 'contents next to the PLACEHOLDER', and remove PLACEHOLDERS whenever they're 
      right before a (."

      if there's a PLACEHOLDER right before a parenthesis, remove it
      also the capture group $n's only available with a RegExp object if you're using it to replace
        and replace can on'y replace multiple times if there's a global flag (specified in the RegExp)
    */
    const regEndQuote = new RegExp("PLACEHOLDER([^\) ]+)", "g");
    //const regParenthesisStartText = new RegExp("\\(" + "([^\( ])", "g");
      //.replace(regParenthesisStartText, "(PLACEHOLDER$1")
    temp = result.replaceAll("PLACEHOLDER(", "(")
      .replace(regEndQuote, (temp + letter + " contains '$1'"));
    return (temp);
  });
}

    /*
    if(result.indexOf("(") == 0)
      return ("(" + temp + letter + " contains '"  + result.substring(1) + "'");
      else
        return (temp + letter + " contains '"  + result + "'");
    */


/*checks if anything needs to be done in order of importance, then sends it to be worked on
  this function should help separate the work with each pass
*/
/*may need to rewrite andOrSplit oto not put the whole sequence of letters in there, and
maybe map out the whole sequence in your notes, potentially with inkscape or a graph thing
so you can pinpoint what to change way faster.
*/
async function parseCheck(text, letter){
    console.log("inside parseCheck with %s", text);
  var temp = "";

  //order of parsing: quotations, parenthesis, and/or; for now it should jsut be ands & ors
  //make sure there's a string with content first, though
  if(text != ""){
    temp = text;
  //////////////////////includes can't be a regex 
    /*if(temp.includes("\""))/preserve all text in quotes first
      temp = await quoteCheck(temp, letter);
      
      else if (look below) 
    */
    if(temp.includes("(") && temp.includes(")"))//then group all the text in parenthesis, but dont put and/or inside at first
      //need bracketCheck since included parenthesis will be in awkward places otherwise.
      temp = await bracketCheck(temp, letter);

    else if(temp.includes("|") || temp.includes(" "))
      temp = await andOrSplit(temp, letter);

    //if there's nothing to do, return/resolve the string back to the function
    return new Promise((resolve)=>{
      resolve(temp + "");
    });
  }

  else //empty string
    return new Promise((resolve)=>{
      resolve(text);
    });
}


//return new Promise((resolve) => {});



/*if there's any spaces, replace them with " and LETTER contains"
  cat|egg fish should return (letter contains cat or )
*/
function andOrSplit(str, letter){
  var andCheck = str.includes(" ");
  var orCheck = str.includes("|");
  const splitted = [];
  
  if(!andCheck && !orCheck)
    return new Promise((resolve) => {resolve(str)});

  //either split for ands (spaces) OR split for ors (|)
  //spread syntaxxxxx where you need to add array things 1 by 1, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax 
  //really useful with the push function 
  if(andCheck)
    splitted.push(...(str.split(" ")));
  
  else if(orCheck)
    splitted.push(...(str.split("\|")));

  //send each one to parseCheck & load inthe to the promise arr
  const wait = [];
  splitted.forEach((e)=> wait.push(parseCheck(e, letter)))

  //after they resolve, loop through them and make a long string while adding " and [letter] contains " between each one
  //remember the ' efore & after each string inside processed
  return Promise.all(wait).then((processed)=>{
    var result = processed.join(
      (andCheck? " and " : " or ") + "PLACEHOLDER");
    return(result);
  });
}



/*checks for the positions of the first and second quotation, first search starting from the front, then the back.
  if there's two, save the text in the middle of the quotes to append to another check 
  you can indexOf the first quote, then if that works you can startsearching for the otehr quote with a loop or function that can check backwards
    -1 for the first quote: just resolve the original string
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf 
  if the start index is less than 0 or the end is > length, it gets fixed up to 0 or down to the string's length automatically
    and if the start & end are the same, it should give an empty string, so check for that. 
      if it does, don't send that empty string to another function plz
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
    
    if there was a second quote (after checking from the back), get the substring indexes, then send 1-2 substrings to parseCheck that were outside the quotes
      if the quotes were on the first and last characters, just resolve the string itself. It might not be that common so maybe don't check for it at first

    like ...aaa "bbb" ccc...
      aaa & cc get gets checked for symbols with parseCheck while "bbb" gets preserved whether or not it has other symbols in it
    */
async function quoteCheck(text, letter){
  var index1 = -1, index2 = -1;
  index1 = text.indexOf("\"");
  
  //it'll return the same index if you start searching where you found the key, so add 1 to it
  if(index1 != -1 && index1+1 < text.length)
    index2 = text.indexOf("\"", index1+1);

  var onlyOneCheck = true;

  //if there was one match for a quotation but nothing else, just split the text in half and add a " in the middle of the 2 promised texts.
  //if there was none found, I don't know how this function got called by parseCheck smh
  if((index1 != -1) * (index2 != -1))
    onlyOneCheck = false;

  if(onlyOneCheck){
    console.log("one quotation for this sting: %s", text);
    const currentResultArr = text.split("\"");

    const promises = [parseCheck(currentResultArr[0], letter), 
      parseCheck(currentResultArr[1], letter)];

    return await Promise.all(promises).then((theArr)=>{
      return theArr[0] + "\"" + theArr[1];
    });
     
  }
  else{
    //dont want to include the beginning ", so +1 the index
    var currentResult = text.substring(index1+1, index2);

    //console.log("%d and %d\nstring beign appended soon: %s", index1, index2, currentResult);
    var leftStr = text.substring(0, index1);
    var rigthStr = text.substring(index2+1);

    var lProm = "", rProm = "";

    //checks for any other symbols on the left or right of the found substring.
    lProm = parseCheck(leftStr, letter);
    rProm = parseCheck(rigthStr, letter);

    //push to a NEW, UNNAMED promise array using lProm/rProm vars if there's anything other symbols in the left or right you need to check
    //await the promise array, then concat the whole string in the end with the "text" preserved...
    return await Promise.all([lProm, rProm]).then((theArr) => {
      console.log("returning %s - %s -  %s", theArr[0], currentResult, theArr[1]);
      return(theArr[0] + currentResult + theArr[1]);
    });
  }
}

/*encloses everything in parenthesis and removes and/or directly after the frist parenthesis. using the number of found ( and )'s makes a substring to send to parseCheck
  where (dept<>'Eng' and isSenior=true) or (dept='Sales') or seniorityStartTime is null
 */
async function bracketCheck(text, letter){
  //regExp.exec can iterate over multiple matches & return index positionss since it saves its state
  
  /*until it returns null, get the index property of the resulting array each time & push to the array, 
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    https://stackoverflow.com/questions/9690429/get-multiple-character-positions-in-array
    also check if the global flag's effected by multiple threads

    
    it may be easier to just use matchAll with a g-flag regexp, way easier to iterate instead of making your own loop & stuff,
      but you can't control the way it goes as much. YOu also don't use the lastFound thingy with the global, but 
      syou need to use the global still
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll#examples
      you can also change how matchAll behaves with the @@matchAll override-y thing, but idk if that's necessary atm.
    If you want more control over the iteration or something else, you can still do the plain regexp matching 1 by 1, but the matchall seems like the best thing
      atm
  //first left ('s then right )'s.
    const leftBrackets = [], rightBrackets = [];
    var arrTemp;
    const reg = RegExp();
    while((
    arrTemp = 
  )){}*/

  //finding all spots where the parenthesis are
  const regBracket = new RegExp("\\(|\\)", "g");

  //array with properties like properties like "index"
  const bracketIterable = text.matchAll(regBracket);

  //go through the array, taking note of all starting positions of the ( and )'s
  const matches = Array.from(bracketIterable);

  //helps count the open and closed brackets when determining the substring to send to parseCheck
  var passedOpenBrackets = 0, stop = false;
  let correctOpen = 0, correctClose = 0;
  
  for(let i = 0; i < matches.length && !stop; i++){
    //if the bracket's a right bracket, continue & keep continuing until it finds an open bracket in the results
    if(matches[i][0].includes(")"))
      continue;

    //otherrwise, go into the inner loop and find the closing bracket for it
    else{
      for(let j = i+1; j < matches.length && !stop; j++){
        //when seeing another open prace, increment opened brackets by 1 
        //but when seeing a closed bracket, reduce by 1. If the count's at 0 and it sees a closed bracket save that index
        switch (matches[j][0].includes("(")){
          case true:
            passedOpenBrackets++;
          break;

          default:
            if(passedOpenBrackets == 0){
              stop = true;
              correctOpen = matches[i].index;
              correctClose =  matches[j].index;
            }
            
            passedOpenBrackets--;
        }          
      }
    }
  }

  /*if "stop" was never set to "true", there might've not been a set of parenthesis to return with i & j, so send _____
  if a match was found, send...
    the tex to the left of the 1st index found (if it's not index 0), 
    the contents inside the 2 parenthesis (if there's an index in between the two), 
    and the contents to the right of the last index (if the index isn't length-1 of the text)

    the parenthesis should be placed appropiately in between the parseCheck promises
  */
  if(!stop)
    return new Promise((resolve)=>{resolve(text)});
  else{

    const prom = [
        (correctOpen != 0? 
          parseCheck(text.substring(0, correctOpen), letter) : ""),
        (correctClose != correctOpen + 1?
          parseCheck(text.substring(correctOpen + 1, correctClose), letter) : ""),
        (correctClose != matches.length - 1?
          parseCheck(text.substring(correctClose+1), letter) : "")
    ];
    return await Promise.all(prom).then((theFinishedOne)=>{
      return theFinishedOne[0] + "(PLACEHOLDER" + theFinishedOne[1] + ")" + theFinishedOne[2];
    });
  }
}


  /*using the length of each array, determine which indexes will be the boundaries of the substring to send to parseCheck
    there should be an equal amount of ( and ) between the picked indexes
    if there's no fit match, attempt to check with the next ( if there is one, but if not, return the original text.
  */






//run the test after auto-executing if debugging doesn't wanna work, or rename test() if apps script tries to run a different function's test()
//test();

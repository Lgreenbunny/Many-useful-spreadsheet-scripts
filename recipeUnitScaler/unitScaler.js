function test(){
  //unitScaler(userMeasurement, wholeScale, [tableMeasurement, tableGram, [anything]])
  //first []'s for us measurement conversions, the first 2 arguments are needed for all modes
  //unitScaler("16 oz", 1, "2 pound", 56, "yee");
  unitScaler("90 g", 1, "2/3 cup", 90);
}


//scaled to cups
const usConversions = new Map([
  ["tsp", 48],
  ["teaspoon", 48],
  ["tbsp", 16],
  ["tablespoon", 16],
  ["cup", 1],
  ["ml", 236.588], 
  ["milliliter", 236.588], 
  ["l", 0.236588],
  ["liter", 0.236588],
  ["lq oz", 8],
  ["liquid ounce", 8]
]);

//scaled to grams
const weightOnlyConversions = new Map([
  ["g", 1],
  ["kg", 1000],
  ["oz", 28.35],
  ["ounce", 28.35],
  ["lb", 453.59],
  ["pound", 453.59]
]);


async function unitScaler(userMeasurement, wholeScale, tableMeasurement, tableGram) {
  // return scale compared to original mode//////////////////
  if(arguments.length == 5){

    //send the userMeasurement to parseNum
    const promResults = [];
    promResults.push(parseNum(userMeasurement));
    promResults.push(parseNum(tableMeasurement)); // just in case the unit's a

    const results = await Promise.all(promResults).then((results)=>{
      console.log(`the current parsenum results:
      ${results[0].value}
      ${results[0].unit}
      andddd...
      ${results[1].value}
      ${results[1].unit}`);

      return results;

    });

    //if the user.unit's null, it's a plain number that'll be scaled without anything else, like 2 apples
    if(results[0].unit == "no unit")
      return results[0].value;

    // user.unit = "gram/g", user.value/tableGram
    if(results[0].unit.match("(gram|g)(s)*"))
      return results[0].value/tableGram;

    //else, convert the userMeasure to the same unit as tableMeasurement based on the table and thenn divide both values to get the scalee
    var userConverted = await conversionScaler(results[0], results[1]).then((results)=>{
      //just waiting to print the values for testing

      //the console.log %s & %d don't like the numbers, so maybe that needs to be looked into. They do appear in the logs when printed this way, though.
      const logg = [
        "userConverted value: ",
        results
      ];
      
      logg.forEach((e) => {
        console.log(e);
      });
      return results;
    });

    return userConverted/results[1].value;
  }



  // the scale-only mode////////////////////
  else if(userMeasurement != "" && arguments.length == 2){ 
    //can't use indexOf or includes here if it's a numeric value, mostly just works for strings
      var temp = await parseNum(userMeasurement);
      console.log("This is for the scale-only-mode query %s and recipe %s.\nold gram: %d\n\t Result will be: %d", 
        userMeasurement, tableMeasurement, tableGram, temp.value);
      return  temp.value*wholeScale + (temp.unit != null ? " " + temp.unit : "");
  }



  /* the us measurement to gram mode/////////////////
    if the userMeasurement's not a plain number, 1 cup, 1/4 tsp...
    find the actual decimal number first, otherwise continue to the next step*/
  else if (userMeasurement != "" && tableMeasurement != "" && tableGram != ""){ 
    const results = [];
    results.push(parseNum(userMeasurement));
    
    // if the tableMeasurement's not a plain number, do similar steps to the code above, else continue
    results.push(parseNum(tableMeasurement));
    const temp = await Promise.all(results);
    //{value, unit}

    var recipe = temp[0];
    var query = temp[1];


    //if the recipe has grams as a unit or none at all, just multiply/////////////////
    if(recipe.unit == null || recipe.unit.match("(g)|(gram.*)")){
      return wholeScale * recipe.value;
    }
  

    //if both the recipe and query objecta had units///////////////
    if(recipe.unit != null && query.unit != null){
      var convertResult = await (conversionScaler(temp[0], temp[1]));

      return tableGram * (convertResult/query.value)*wholeScale;

    }

    ////////if there's no units in the query (only grams/plain numbers)///////////////
    else if(recipe.unit == null && query.unit == null){
      var resultTemp = (recipe.value/query.value)*Number(tableGram)*wholeScale;
      console.log("This is for query %s and recipe %s.\nold gram: %d\n\t Result will be: %d", 
        userMeasurement, tableMeasurement, tableGram, resultTemp);

      //wholeNumber, inGrams
      return (resultTemp/tableGram) + ", " + resultTemp + "g";
    }

    //if the recipe measurement's in grams in us-measurement mode/////////////////////

    //otherwise, eeeeeee//////////////////////
    else
      return "....";
  }


  //function arguments don't match anything/////////////////
  else{
    return "Something's missing...";
  }
}


/*parse fractions or decimals here, 
return an primise that resolves an object with the decimal val(may be a whole num or greater) 
& denominator(may be null for plain decimals)

you couldddd use eval() if you're the only one using this and there's no danger for the input to be malicious...*/
function parseNum(arrayVar){
  var sum = 0;
  var unitVar = "no unit";

  return new Promise((resolve)=>{
    if(!isNaN(arrayVar))//there was only a plain decimal number in arrayVar, no fractions
      resolve({value: arrayVar, unit: unitVar});

    else{//convert the string to a number value
      const arr = arrayVar.split(" ");

      if(Array.isArray(arr)){
        //parse the parts of the array differently since the numer has multiple parts to it 

        for(var i = 0; i < arr.length; i++){
          var temp = arr[i];

          //handle fractions and their '/''s
          if(temp.includes("/")){
            var sumTemp = temp.split("/");
            sum += (Number(sumTemp[0]) / Number(sumTemp[1]));
          }
          
          //or
          else{
            if(isNaN(temp)) //save the word found as a unit of measurement (g, gram, cup, ml...)
              unitVar = temp;
            
            else //add to the sum since it's a plain number value
              sum += Number(temp);
          }
        }
      }
        
      //if there's only a number/unit, just convert to 
      else
        sum = Number(arr);
    }

      resolve({value: sum, unit: unitVar});
    });
}

//using the objects made by parseNum, adjusts the recipe amount based on the query's unit/grams
function conversionScaler(recipe, query){
  return new Promise((resolve)=>{
    const british = recipe.unit.match("^(g|kg|oz|lb)");
    if(british == null){
      resolve(
        recipe.value * (usConversions.get(query.unit) / usConversions.get(recipe.unit))
      );
    }
    else{
      resolve(
        recipe.value * (weightOnlyConversions.get(query.unit) / weightOnlyConversions.get(recipe.unit))
      );
      
      //var convertedRecipeValue = recipe.value * (weightOnlyConversions.get(query.unit) / weightOnlyConversions.get(recipe.unit));
    }
    //to convert 3 tbsp to tsp, you would have to multiply by 4 to scale it to that level
    //4 comes from tsp/tbsp, 4 tsp = 1 tbsp, 4/1, more explanation below 
  });
}   
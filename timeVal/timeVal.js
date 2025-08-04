function timeTest(){
  timeVal([["", 2, 3]]);
} 

//makes a date value out of the arguments where 1 day = 1, half a day = .5, etc
function timeVal(dayHourMinSec){
  var result = 0;

  const divisors = [1.0, 24.0, 60*24.0, 60*60*24.0];
  for(var i = 0; i < dayHourMinSec[0].length; i++){
    var temp = dayHourMinSec[0][i];
    switch(temp){
      case "":
      case null:
      case undefined:
        break;
      default:
        result += temp/divisors[i];
    }
  }

  return result;
  
}

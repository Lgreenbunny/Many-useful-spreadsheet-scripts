function recipeSetter(arr){//2d arr, see doc for recipeTally struct
    //col A:C don't need to be filled, you can just filter out the blanks from craftingTally
      return new Promise((resolve) => {
        const result = {left: [], right:[]};
        /* make 2 array, one with final ingredients and the other with "broken down"/raw ingredients
          (switch to filling in the 2nd array whenever the forst cell in the row matches "broken down")
        */
        var left = true; 
        for(var i = 1; i < arr.length; i++){
          if(arr[i][0].includes("broken down") || arr[i][0] == ""){
            left = false;
            continue; // don't put "broken down" in the results
          }
          
          if(left)
            result.left.push(arr[i]);
          else
            result.right.push(arr[i]);
        }
        console.log("result of recipeSetter:");
        console.log(result);
        resolve(result);
      });
    }
    
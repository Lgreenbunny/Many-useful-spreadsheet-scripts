async function menuSet(){
  const tallySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("crafting tally");

  const mainSpreadSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  const names = [];

  const pat = /(help)|(tally results)|(crafting tally)|(recipe entry)/;
  mainSpreadSheet.forEach((e)=> {
    var name = e.getName();
    if(!pat.test(name))
      names.push(name);
  });
  
  console.log("names found by menuSet");
  console.log(names);

  tallySheet.getRange("I1").setValue(names.join(";"));
  var tempRange = await rangeStarter("I", 1, [names]);
  await rangeTransfer(tallySheet, tempRange, [names]);
  return new Promise((res) => res("finished setting the menu items!"));
}
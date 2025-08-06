async function quickTest() {//quickQuery(comparisons, searchFields)
  const quickQuerySheet = SpreadsheetApp.openById("174VcY4BFKQQSiY0Wovw76BtWVpEgDjFJSRHSOgL5AB0")
    .getSheetByName("quickQueryTest");

  const searchArr = quickQuerySheet.getRange("G5:K5").getValues();
  const comparisonString = quickQuerySheet.getRange("G2").getValue();

  return quickQuery(comparisonString, searchArr);
}

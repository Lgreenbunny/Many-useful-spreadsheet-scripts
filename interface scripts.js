//1200x 1000h spans most of the page whenever the screen's taking up most of the window, but potentially make the interface smaller than that
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Crafting interface')
    .addItem('Start (wide)', 'craftingInterface').addToUi();
}

function craftingInterface() {
  var html = HtmlService.createHtmlOutputFromFile('interface')
    .setWidth(1200).setHeight(1000);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'My custom dialog');
}

function buttonLaunchTest(){
  console.log("Successfully hit that button!");
}
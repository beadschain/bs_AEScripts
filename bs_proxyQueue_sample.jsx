/*
=========================================================================================================
bs_proxyQueue_sample.jsx

プロキシを、レンダーキューに追加するスクリプトです。
使い方はこちらをご覧ください→ https://youtu.be/0UPplQYElFQ?t=35
※各ボタンの名前と、出力設定をカスタマイズしてご使用ください。

for Adobe After Effects CC2014
Author: BANNO Yuki
=========================================================================================================
*/


var everyItem = app.project.items;
    
    selectedComps = new Array();
    for (var i = everyItem.length; i >= 1; i--) {
        eyeTem = everyItem[i];
        if ((eyeTem instanceof CompItem) && eyeTem.selected) {
            selectedComps[selectedComps.length] = eyeTem;
        }
    }
  app.beginUndoGroup("bs_proxyQueue");
  
function showDialog()
{
	var selectedIndex = -1;
	var w = new Window("dialog","bs_proxyQueue",[0,0,300,200]);
	w.center();
	var rb0 = w.add("radiobutton",[30,30,300-10,60],"normal"); //必要あれば、設定等書き足して使用してください
	var rb1 = w.add("radiobutton",[30,70,300-10,100],"high"); //必要あれば、設定等書き足して使用してください
	var btnOK = w.add("button",[10,120,300-10,150],"OK",{name:'ok'});
	var btnCancel = w.add("button",[10,160,300-10,190],"cancel",{name:'cancel'});
	rb0.value = true;	//初期値を設定
	selectedIndex = 0;
	rb0.tag = 0;
	rb1.tag = 1;
 
	rb0.onClick =
	rb1.onClick = function(){ selectedIndex = this.tag;}
 
	this.result = function(){ return selectedIndex;}
	this.show = function(){return (w.show() < 2);}
}
 
var dlg = new showDialog;
if (dlg.show() == true){
	if(dlg.result() == 0){
        var renderTemp = "現在の設定";　//normalレンダリング設定
        var moduleTemp = "TIFF シーケンス (アルファ付き)";　//normal出力モジュール
        }else if(dlg.result() == 1){
        var renderTemp = "現在の設定";　//highレンダリング設定
        var moduleTemp = "TIFF シーケンス (アルファ付き)";　//high出力モジュール
        }
            
            
    
    for (var n = (selectedComps.length-1); n >= 0; n--) {
        item = selectedComps[n];
        item.useProxy = false;
	var renq = app.project.renderQueue.items.add(item);
	renq.applyTemplate(renderTemp); 
	renq.outputModule(1).applyTemplate(moduleTemp);
    var path = app.project.file.path.replace("/d","D:")+"\\_proxy"; //プロキシ設定なしだった場合の出力先（aepファイルからの相対パス）（ドライブがD:でなければ書き変えてください）
    var fileTemp = "[compName]\\[compName]_[#####].[fileextension]";
    if(item.proxySource != null){
	path = item.proxySource.file.path.replace("/d","D:"); //プロキシ設定ありだった場合の出力先（ドライブがD:でなければ書き変えてください）
    fileTemp = "[compName]_[#####].[fileextension]";
    }
var new_data = {
    "Output File Info":{
 "Base Path":path,
 "File Template":fileTemp
 },
"Post-Render Action":"Set Proxy",
};

renq.outputModule(1).setSettings(new_data);
                }
            }
    app.endUndoGroup();
    
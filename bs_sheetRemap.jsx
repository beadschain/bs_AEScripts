/*
=========================================================================================================
bs_sheetRemap.jsx

CLIP STUDIO PAINTからタイムシート出力したcsvデータを読み込んで、AEのタイムリマップに変換するスクリプトです。
使い方はこちらをご覧ください→ https://youtu.be/umE-cs-RD0w

for Adobe After Effects CC2014
Author: BANNO Yuki
=========================================================================================================
*/

var undoStr = "bs_sheetRemap";
var activeComp = app.project.activeItem;


function showDialog()
{
	var w = new Window("dialog","bs_sheetRemap",[0,0,300,500]);
	w.center();
    var list = w.add ("listbox", [10, 10, 300-10, 380]);
    for(var i = 1; i< myText[1].split(",").length; i++){
        var celName = myText[1].replace(/"/g,"").split(",")[i];
        list.add("item",celName);
        }
	var btnOK = w.add("button",[10,400,300-10,440],"OK",{name:'ok'});
	var btnCancel = w.add("button",[10,450,300-10,490],"cancel",{name:'cancel'});
    list.selection=0;

 
	this.result = function(){ return (list.selection.index);}
	this.show = function(){return (w.show() < 2);}
}

if(activeComp instanceof CompItem){
    var Lay = activeComp.selectedLayers[0];
    if(Lay){
        if(Lay.canSetTimeRemapEnabled){

var fileName = File.openDialog("Select csv file","");
if(fileName){
var myFile = new File(fileName);
if (myFile.open("r")){
    var myText = new Array();
    while(!myFile.eof){
        myText.push(myFile.readln());
        }

 
var dlg = new showDialog;
if (dlg.show() == true){
    var celID = dlg.result();
    var frArr = new Array();
    var celArr = new Array();
    var karaArr = new Array();
    
    //キー情報の配列をとる-------------------------------------------------------------------
    
    var firstCel = myText[2].replace(/"/g,"").split(",");
    if(firstCel[celID+1] == ""){ //一コマ目が空セルの場合
        frArr.push(0);
        celArr.push(0);
        karaArr.push(0);
        }
        
        for( i = 2; i < myText.length;i++){
            var CKcel= myText[i].replace(/"/g,"").split(",");
            var errFlag =0;
        if(CKcel[celID+1] != ""){
            frArr.push((CKcel[0]-1)/24);
            if(CKcel[celID+1] == "×"){//空セルの場合
                celArr.push(0);
                karaArr.push(frArr.length-1);
                }else if(isFinite(CKcel[celID+1])){
            celArr.push((CKcel[celID+1]-1)/24);
            }else{
                errFlag =1;
                break;
                }
            }
            }
        
    
    //選択したレイヤーにキーを打つ-------------------------------------------------------------------
    
    if(errFlag == 0){
        if(Math.max.apply(null, celArr)<Lay.source.duration){ //セル指定の最大値が、レイヤーソースの尺を越えていないことを確認
    app.beginUndoGroup(undoStr);
    Lay.timeRemapEnabled = true;
    Lay.timeRemap.removeKey(2);
    Lay.timeRemap.setValuesAtTimes(frArr,celArr);
    for(i = 1; i<= Lay.timeRemap.numKeys; i++){
        Lay.timeRemap.setInterpolationTypeAtKey(i, KeyframeInterpolationType.LINEAR , KeyframeInterpolationType.HOLD);
        }

 　//空セルの分をブラインドエフェクトで非表示にする-------------------------------------------------------------------
    
    
    if(karaArr != "" ){
        var karaEF = Lay.effect.addProperty("ADBE Venetian Blinds");
karaEF(1).setValueAtTime(0,0);
for(i=0; i<= karaArr.length-1; i++){
    karaEF(1).setValueAtTime(frArr[karaArr[i]],100);
    if(frArr[karaArr[i]+1]){
    karaEF(1).setValueAtTime(frArr[karaArr[i]+1],0);
    }
}
for(i = 1; i<= karaEF(1).numKeys; i++){
    karaEF(1).setInterpolationTypeAtKey(i, KeyframeInterpolationType.LINEAR , KeyframeInterpolationType.HOLD);
    }
}

　 //レイヤーのイン点とアウト点の処理-------------------------------------------------------------------

Lay.outPoint = activeComp.duration;
if(karaArr[0] == 0){
    Lay.inPoint = frArr[1];
    }
if(karaArr[karaArr.length-1]== frArr.length-1){
    Lay.outPoint = frArr[frArr.length-1]
    };
      
    app.endUndoGroup();
    }else{
        alert("レイヤーのソースの長さが、セルの枚数に対して足りません");
        }
    }else{
       alert("セル指定に、数値、空セル（×）以外のものが含まれています。タイムシートを確認してください");
    }
      }else{
            //alert("リスト表示時にキャンセルされました");
        }
    }
}else{
    //alert("csv選択時にキャンセルされました");
}
}else{
    alert("選択したレイヤーはタイムリマップが利用できません");
}
}else{
    alert("レイヤーを選択してください");
}
}else{
    alert("コンポジションをアクティブにしてください");
}
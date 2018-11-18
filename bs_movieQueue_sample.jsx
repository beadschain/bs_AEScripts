/*
=========================================================================================================
bs_movieQueue_sample.jsx

ムービーを、レンダーキューに追加するスクリプトです。
使い方はこちらをご覧ください→ https://youtu.be/0UPplQYElFQ
※各ボタンの名前と、出力設定をカスタマイズしてご使用ください。

for Adobe After Effects CC2014
Author: BANNO Yuki
=========================================================================================================
*/

var undoStr = "bs_movieQueue";
var activeComp = app.project.activeItem;


if((activeComp != null)&&(activeComp instanceof CompItem)){
	app.beginUndoGroup = (undoStr);

function showDialog()
{
	var selectedIndex = -1;
	var w = new Window("dialog","bs_movieQueue",[0,0,150,230]);
	w.center();
	var rb0 = w.add("radiobutton",[10,30,150-10,60],"temp_A"); //temp_Aの名前
	var rb1 = w.add("radiobutton",[10,70,150-10,100],"temp_B"); //temp_Bの名前
	var rb2 = w.add("radiobutton",[10,110,150-10,140],"temp_C"); //temp_Cの名前
	var btnOK = w.add("button",[10,150,150-10,180],"OK",{name:'ok'});
	var btnCancel = w.add("button",[10,190,150-10,220],"cancel",{name:'cancel'});
	rb0.value = true;	//初期値を設定
	selectedIndex = 0;
	rb0.tag = 0;
	rb1.tag = 1;
	rb2.tag = 2;
 
	rb0.onClick =
	rb1.onClick =
	rb2.onClick = function(){ selectedIndex = this.tag;}
 
	this.result = function(){ return selectedIndex;}
	this.show = function(){return (w.show() < 2);}
}
 
var dlg = new showDialog;
if (dlg.show() == true){
	if(dlg.result() == 0){
        //-----------------以下、temp_Aの設定------------------------------------------
        var DT=new Date(); 
	var yy = DT.getFullYear()%100;
	var mm = ("00"+(DT.getMonth()+1)).slice(-2);
	var dd = ("00"+DT.getDate()).slice(-2);
	var FN = activeComp.name+"_"+yy+mm+dd; //出力名
	var renq = app.project.renderQueue.items.add(activeComp);
	renq.applyTemplate("最良設定");  //レンダリング設定
	renq.outputModule(1).applyTemplate("ロスレス圧縮");　//出力モジュール
	renq.outputModule(1).file = new File("D:/" + FN); 　//出力先
    }else if(dlg.result()== 1){
        //-----------------以下、temp_Bの設定------------------------------------------
        var DT=new Date(); 
	var yy = DT.getFullYear()%100;
	var mm = ("00"+(DT.getMonth()+1)).slice(-2);
	var dd = ("00"+DT.getDate()).slice(-2);
	var FN = activeComp.name+"_"+yy+mm+dd; //出力名
	var renq = app.project.renderQueue.items.add(activeComp);
	renq.applyTemplate("最良設定");  //レンダリング設定
	renq.outputModule(1).applyTemplate("ロスレス圧縮");　//出力モジュール
	renq.outputModule(1).file = new File("D:/" + FN); 　//出力先
    }else if(dlg.result()== 2){
        //-----------------以下、temp_Cの設定------------------------------------------
         var DT=new Date(); 
	var yy = DT.getFullYear()%100;
	var mm = ("00"+(DT.getMonth()+1)).slice(-2);
	var dd = ("00"+DT.getDate()).slice(-2);
	var FN = activeComp.name+"_"+yy+mm+dd; //出力名
	var renq = app.project.renderQueue.items.add(activeComp);
	renq.applyTemplate("最良設定");  //レンダリング設定
	renq.outputModule(1).applyTemplate("ロスレス圧縮");　//出力モジュール
	renq.outputModule(1).file = new File("D:/" + FN); 　//出力先
    }
}	
	app.endUndoGroup();
	}else{
		alert("コンポジションを選択してください");
		}

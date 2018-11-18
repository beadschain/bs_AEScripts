/*
=========================================================================================================
bs_panTrace.jsx

カメラコンポでつけたカメラワークを、大判コンポのほうで参照できるようにするスクリプトです。
使い方はこちらをご覧ください→ https://youtu.be/PIRwKZNJ8CQ

for Adobe After Effects CC2014
Author: BANNO Yuki
=========================================================================================================
*/

var undoStr = "bs_panTrace";
var activeComp = app.project.activeItem;

function showDialog()
{
	var w = new Window("dialog","bs_panTrace",[0,0,300,500]);
	w.center();
    var list = w.add ("listbox", [10, 10, 300-10, 380]);
    for(var i = 0; i< activeComp.usedIn.length; i++){
        compName = (activeComp.usedIn[i].name);
        list.add("item",compName);
        }
	var btnOK = w.add("button",[10,400,300-10,440],"OK",{name:'ok'});
	var btnCancel = w.add("button",[10,450,300-10,490],"cancel",{name:'cancel'});
    list.selection=0;
    
	this.result = function(){return (list.selection.index);}
	this.show = function(){return (w.show() < 2);}
}


if((activeComp != null)&&(activeComp instanceof CompItem)){
	if(activeComp.selectedLayers.length == 1){
            if(activeComp.usedIn.length >= 1){
                var dlg = new showDialog;
                if (dlg.show() == true){
    var pComp = activeComp.usedIn[dlg.result()];
    for(var i = 1; i <= pComp.layers.length;i++){
    var Lay = pComp.layer(i);
    var Source = Lay.source;
    if(Source){
        if(Source.name == activeComp.name){
            var compLay = Lay;
            panNull = Lay.parent;
            };
    };
    };
if(panNull){
        app.beginUndoGroup(undoStr);
		var frameLay = activeComp.selectedLayers[0];
        
        //--------------フレームの位置、回転、スケールをリセット-------------------------------------------------------
        for(var i=1; i<=frameLay.position.numKeys; i){
            frameLay.position.removeKey(1);
            };
        for(var i=1; i<=frameLay.scale.numKeys; i){
            frameLay.scale.removeKey(1);
            };
        for(var i=1; i<=frameLay.rotation.numKeys; i){
            frameLay.rotation.removeKey(1);
            };
        
        frameLay.position.expression = "";
        frameLay.scale.expression = "";
        frameLay.rotation.expression = "";
        
        frameLay.position.setValue([activeComp.width/2,activeComp.height/2]);
        frameLay.scale.setValue([100,100]);
        frameLay.rotation.setValue([0]);
        
        //--------------レイヤーを追加-------------------------------------------------------
        
	var panTraceNull = activeComp.layers.addNull(activeComp.duration);
    panTraceNull.name = "panTrace_null";
    panTraceNull.moveBefore(frameLay);
    var rotTraceNull = activeComp.layers.addNull(activeComp.duration);
    rotTraceNull.name = "rotTrace_null";
    rotTraceNull.moveBefore(panTraceNull);
    var endLay = frameLay.duplicate();
    endLay.moveBefore(frameLay);	
    endLay.name = "frame_"+("0000"+(activeComp.duration*24)).slice(-4);
    var startLay = frameLay.duplicate();
    startLay.name = "frame_0001";
    startLay.moveBefore(frameLay);	
    	
    frameLay.parent =panTraceNull;
    panTraceNull.parent = rotTraceNull;

    endLay.position.expression = 'thisComp.layer("panTrace_null").toComp([0,0,0],(name.split("_")[1]-1)/24);';
    endLay.scale.expression = 'thisComp.layer("panTrace_null").scale.valueAtTime((name.split("_")[1]-1)/24);';
    endLay.rotation.expression = 'thisComp.layer("rotTrace_null").rotation.valueAtTime((name.split("_")[1]-1)/24);';
    
    startLay.position.expression = 'thisComp.layer("panTrace_null").toComp([0,0,0],(name.split("_")[1]-1)/24);';
    startLay.scale.expression = 'thisComp.layer("panTrace_null").scale.valueAtTime((name.split("_")[1]-1)/24);';
    startLay.rotation.expression = 'thisComp.layer("rotTrace_null").rotation.valueAtTime((name.split("_")[1]-1)/24);';
    
	panTraceNull.position.expression = 'panComp = comp("'+pComp.name+'");\n'
    +'panCompCenter = [panComp.width/2,panComp.height/2,0];\n'
    +'panPosi = panComp.layer("'+panNull.name+'").position;\n'
    +'p = panCompCenter-panPosi;\n'
    +'[p[0],p[1]]';
    
    rotTraceNull.position.expression = 'panComp = comp("'+pComp.name+'");\n'
    +'compLay = panComp.layer("'+compLay.name+'");\n'
    +'compLay.anchorPoint-compLay.position';
    
    rotTraceNull.rotation.expression = 'panComp = comp("'+pComp.name+'");\n'
    +'ctrlLay = panComp.layer("'+panNull.name+'");\n'
    +'-ctrlLay.rotationZ'
    
    if(panNull.threeDLayer == true){
        
        var zCtrlLay = pComp.layers.addShape();
        zCtrlLay.name = "["+activeComp.name+"]_frameCtrl";
        zCtrlLay.enabled = false;
        zCtrlLay.guideLayer = true;
        var slideEF = zCtrlLay.effect.addProperty("ADBE Slider Control");
        slideEF.name = ("TU.TBボリューム");
        slideEF(1).setValue([20]);
    panTraceNull.scale.expression= 'panComp = comp("'+pComp.name+'");\n'
    +'ratio = panComp.layer("'+zCtrlLay.name+'").effect("TU.TBボリューム")("スライダー");\n'
    +'if(ratio == 0){\n'
    +'s = 100;\n'
    +'}else{\n'
    +'s = 100+panComp.layer("'+panNull.name+'").position[2]/ratio;\n'
    +'}\n'
    +'[s, s]';
    };
    
    
app.endUndoGroup();
}else{
    alert("cameraコンポにて、パン用のレイヤーが見つかりません(ベースコンポレイヤーの親に指定してください)");
    }
	}
}else{
	alert("カメラコンポが見つかりません（ベースコンポの親コンポがありません）");
	}
}else{
	alert("フレームレイヤーはひとつのみ選択してください");
	}
}else{
			alert("コンポジションを選択してください");
		}


	
	
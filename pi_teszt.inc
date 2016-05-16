<?php
function _pi_wf_teszteredmeny($nid,$sid){
  $submission=_pi_wf_teszt_load($nid,$sid);
  $end=_pi_wf_tesztkiertekel($submission);
  $v=_pi_wf_teszteredmeny_szoveg($end);
  return $v;
}

function _pi_wf_teszt_load($nid,$sid){
  module_load_include('inc','webform','includes/webform.submissions');
  $submission = webform_get_submission($nid, $sid);
  return $submission;
}

function _pi_wf_tesztkiertekel($submission){
  //dpm($submission->data);
  $reverse=array(1,4,5,6,8,9,10,19,21,22,23,24,25,29,30,32,33,34,36,);
  $groups=array(
    1=>array(2,3,12,14,36,8),
    2=>array(7,10,15,16,25,33),
    3=>array(1,5,9,19,21,22),
    4=>array(6,18,23,24,26,29),
    5=>array(4,17,20,28,34,35),
    6=>array(11,13,27,31,30,32),
  );
  $end=array(1=>0,0,0,0,0,0);  
  foreach($submission->data as $sor=>$row){
    $pont=$row[0];
    $pont=(in_array($sor-38,$reverse) ? 6-$pont : $pont);    
    foreach($groups as $sect=>$values){
      if (in_array($sor-38,$values)){
        $end[$sect]+=$pont;
        break;
      }
    }    
  }
  dpm($end);  
  return $end;
}

function _pi_wf_teszteredmeny_szoveg($end){
/*
  $ft=array(
    array('Nem figyel az árakra','Nem tudja beosztani a pénzét','Könnyen elcsábul','Pazarló','Kényelmes, lusta','Figyelmetlen'),
    array('Árérzékeny','Beosztó','Mértéktartó, fegyelmezett','Takarékos','Dolgos, szorgalmas','Kézben tartja a pénzügyeit')
  );
*/
  $sz1=_pi_wf_pui_teszeredmeny_szoveg();
  dpm($sz1);
  $path='/sites/default/files/form/';
  //$colors=array('#ff8c00','#33ff99');
  $v='<table border="0" cellpadding="5" cellspacing="1"><tbody>';
  foreach($end as $i=>$pont){
    $p=($pont<18 ? 0 :1);
    $k=($pont<18 ? 'ALACSONY: 5-17' : 'MAGAS: 17-30');
    $v.='<tr id="sor_'.($i+1).'" style="border-bottom:1px solid lightgrey;">'.
      '<td id="pont_'.($i+1).'" class="rtecenter">'.
        '<img src="'.$path.'szellem'.$i.($p+1).'.jpg" style="width:150px">'.
        '<div><b>PONTSZÁMOD '.$pont.'</b></div>'.
      '</td>'.
      '<td>'.
        '<br /><h3 style="margin-bottom:0px;">'.substr($sz1[$i]['kerdes'],2).'</h3><div>'.  $k.'</div><br /><div>'.$sz1[$i]['valasz'][$p][1].'</div><br />'.
      '</td>'.
    '</tr>';
  }
  $v.='</tbody></table>';
  return $v;
}

function _pi_wf_pui_teszeredmeny_szoveg(){
  $nid=114;
  $sor=2;
  $arr=_pi_wf_koltsegvetesi_kviz_valaszok($nid,$sor);
  return $arr;
}
/*
function _pi_wf_eredmeny_stilus($i,$j,$end){
  $pont=$end[$i];
  $colors=array('#ff8c00','#33ff99');
  $color=($j<18 ? $colors[0] : $colors[1]);
  $style=($j==$pont ? 'background-color:'.$color.';color:white;font-weight:bold;' : 'color:'.$color.';');
  return $style;
}
*/


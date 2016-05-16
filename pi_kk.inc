<?php
//koltsegvetesi_kviz
function _pi_wf_koltsegvetesi_kviz_eredmeny($sid){
  $path=drupal_get_path('module','pi_wf');
  drupal_add_js($path.'/pu_kviz.js');
  module_load_include('inc','webform','includes/webform.submissions');
  $nid=109;
  $submission = webform_get_submission($nid, $sid);
  //dpm($submission);
  $valaszok=_pi_wf_koltsegvetesi_kviz_valaszok();
  dpm($valaszok);
  $atlag=0;
  $helyes=0;
  $htmls=array();
  foreach($valaszok as $ssz=>$tomb){
    $valasz=$submission->data[$ssz+1][0];     //cid=2,3,....
    $valasz=((string)$valasz=='1' ? 'Igaz' : 'Hamis');
    $label=$tomb['valasz'][0][0];
    $class='piros';
    if ($valasz==$label){
      $helyes++;
      $class='zold';
    }
    $szov=$tomb['valasz'][0][1];
    $kerdes=$tomb['kerdes'];
    $htmls[$ssz]='<div class="sor"><div class="kerdes">'.$kerdes.'</div>'.
      '<div class="valasz">A te válaszod:&nbsp;<span class="'.$class.'">'.$valasz.'</span></div>'.
      '<div><span class="valasz-jo">A helyes válasz:</span><span class="label">&nbsp;'.$label.'.</span><div class="szoveg">'.$szov.'</div></div></div>';
  }
  $j=1;
  $x='<div id="oldal_'.$j.'"><div class="oldal">1 / 4. oldal</div>';
  foreach($htmls as $ssz=>$html){
    $x.=$html;    
    if (($ssz % 4)==0 and $ssz<16){
      $j++;
      $x.='<div class="tovabb-gomb">';
      if ($j>2){
        $x.='<span><a href="#oldal_'.($j-2).'" id="vissza_'.($j-2).'" class="gomb">Előző oldal</a></span>';
      }
      $x.='<span><a href="#oldal_'.$j.'" id="tovabb_'.$j.'" class="gomb">Tovább</a></span>';
      $x.='</div></div><!-- oldal -->'.
        '<div id="oldal_'.$j.'"><div class="oldal">'.$j.' / 4. oldal</div>';
    }    
  }
  $x.='<div class="tovabb-gomb"><span><a href="#oldal_'.($j-1).'" id="vissza_'.($j-1).'" class="gomb">Előző oldal</a></span></div>';
  $x.='</div>';
  $v['helyes']=$helyes;
  $v['atlag']=_pi_wf_koltsegvetesi_kviz_atlag();
  $v['html']=$x;
  return $v;
}

function _pi_wf_koltsegvetesi_kviz_valaszok($nid=111,$sor=1){   // 1 | 2 válasz
  //ha változik a webformon a kérdés vagy a válasz, át kell vezetni a node/111-be is!
  //plain text: kerdes+"\r\n"+Igaz/Hamis | cimke +";"+valasz
  $arr=_pi_wf_load_valasz($nid);
  dpm($arr);
  $y=array();
  $k=0;
  $mod=$sor+1;
  foreach($arr as $ssz=>$value){
    if ($ssz % $mod==0){
      $szov=$value[0];
      $z=array();
      $k++;
    } else {
      //$x=explode(';',$value);
      $z[]=$value;
    }
    $y[$k]=array('kerdes'=>$szov,'valasz'=>$z);
  }
  return $y;
}

function _pi_wf_koltsegvetesi_kviz_atlag(){
  $valaszok=_pi_wf_koltsegvetesi_kviz_valaszok();
  $sids=_pi_wf_koltsegvetesi_kviz_mind();
  $nid=109;
  $ossz=$helyes=$atlag=0;
  $i=0;
  module_load_include('inc','webform','includes/webform.submissions');
  foreach($sids as $sid){
    $submission=webform_get_submission($nid, $sid);
    $helyes=0;
    foreach($valaszok as $ssz=>$ert){
      $valasz=$ert['valasz'][0][0];
      $h_valasz=($submission->data[$ssz+1][0]==1 ? 'Igaz' : 'Hamis'); //cid=2,3,....
      if ($valasz==$h_valasz){   
        $helyes++;
      }
      $ossz++;
    }
    $atlag+=$helyes;
    $i++;
  }
  //$v=$helyes*100/$ossz;
  $v=round($atlag/$i,0);
  return $v;
}

function _pi_wf_koltsegvetesi_kviz_mind(){
  $arr=array();
  $sql="select sid from {webform_submitted_data} where nid=109";
  $results=db_query($sql);
  foreach($results as $result){
    $arr[]=$result->sid;
  }
  return $arr;
}

//------------------------


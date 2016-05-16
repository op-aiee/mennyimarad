<?php
function pi_wf_permission(){
  return array(
    'access iskola'=>array(
      'title'=>'Iskola szűrés',
      'description'=>'Iskola szűrés',
    )
  );
}
/*
function _pi_wf_iskola_access(){
  return true;
}
 * 
 */

function _pi_wf_uj_iskola($data){
  dpm($data,'_pi_wf_uj_iskola:data');
  $sql="select * from {iskola} where om_azonosito=".$data[1][0];
  $results=db_query($sql);
  $van=false;
  foreach($results as $result){
    $id=$result->id;
    $van=true;
    break;
  }
  $tid=substr($data[6][0],4);
  $megye_id=_pi_wf_megye_id($tid);  
  $fields=array(
    'om_azonosito'      =>$data[1][0],
    'intezmeny_neve'    =>$data[2][0],
    'megye_id'          =>$megye_id,
    'irszam_id'         =>$data[4][0],
    'cim'               =>$data[5][0],
    'alt_isk'           =>(in_array('tid_469',$data[20]) ? 'X' : null),
    'gimnazium'         =>(in_array('tid_470',$data[20]) ? 'X' : null),
    'szakkozep'         =>(in_array('tid_471',$data[20]) ? 'X' : null),
    'szakiskolai_nevelesoktatas'=>(in_array('tid_472',$data[20]) ? 'X' : null),
    'spec_szakiskola'   =>(in_array('tid_473',$data[20]) ? 'X' : null),
    'alt_isk_db'        =>($data[22][0] ? $data[22][0] : null),
    'gimnazium_db'      =>($data[23][0] ? $data[23][0] : null),
    'szakkozep_db'      =>($data[24][0] ? $data[24][0] : null),
    'szakiskola_db'     =>($data[25][0] ? $data[25][0] : null),
    'spec_szakiskola_db'=>($data[26][0] ? $data[26][0] : null),
    'fenntarto_id'      =>$data[7][0],
    'vezeto'            =>$data[11][0],
    'telefon'           =>$data[12][0],
    'fax'               =>$data[13][0],
    'email'             =>$data[14][0],
    'kepviselo'         =>$data[16][0],
    'kepviselo_telefon' =>$data[17][0],
    'kepviselo_fax'     =>$data[18][0],
    'kepviselo_email'   =>$data[19][0],
  );
  dpm($fields);
  if (!$van){
    db_insert('iskola')->fields($fields)->execute();
  } else {
    $fields['id']=$id;
    db_update('iskola')->fields($fields)->condition('id',$id,'=')->execute();
  }
}

function _pi_wf_uj_fenntarto($data){
  dpm($data,'_pi_wf_uj_fenntarto:data');
  $sql="select id from {fenntarto} where id=".$data[21][0];
  $results=db_query($sql);
  $van=false;
  foreach($results as $result){
    $id=$result->id;
    $van=true;
    break;
  }
  $tid=substr($data[6][0],4);
  //dpm($tid,'_pi_wf_uj_fenntarto:tid');
  $megye_id=_pi_wf_megye_id($tid);
  //dpm($megye_id,'_pi_wf_uj_fenntarto:megye_id');
  $tid=substr($data[20][0],4);
  //dpm($tid,'_pi_wf_uj_fenntarto:tid');
  $fenntarto_tipus_id=_pi_wf_fenntarto_tipus_id($tid);
  //dpm($fenntarto_tipus_id,'_pi_wf_uj_fenntarto:fenntarto_tipus_id');
  $fields=array(
    'id'=>$data[21][0],
    'nev'=>$data[2][0],
    'tipus_id'=>$fenntarto_tipus_id,
    'megye_id'=>$megye_id,
    'irszam_id'=>$data[4][0],
    'cim'=>$data[5][0],
  );
  if (!$van){
    db_insert('fenntarto')->fields($fields)->execute();
  } else {
    db_update('fenntarto')->fields($fields)->condition('id',$id,'=')->execute();
  }
}

function _pi_wf_fenntarto_tipus_id($tid){
  $id=null;
  $sql="select ft.id from {taxonomy_term_data} t join {fenntarto_tipus} ft on ft.tipus collate utf8_general_ci=t.name where t.tid=$tid";
  $results=db_query($sql);
  foreach($results as $result){
    $id=$result->id;
    break;
  }
  return $id;
}

function _pi_wf_megye_id($tid){
  $id=null;
  $sql="select m.id from {taxonomy_term_data} t join {megye} m on m.megye collate utf8_general_ci=t.name where t.tid=$tid";
  $results=db_query($sql);
  foreach($results as $result){
    $id=$result->id;
    break;
  }
  return $id;
}


function _pi_wf_uj_irszam($irszam,$helyseg){
  $sql="select * from {irszam} where irszam='$irszam' and helyseg='$helyseg'";
  $results=db_query($sql);
  $van=false;
  foreach($results as $result){
    $id=$result->id;
    $van=true;
    break;
  }
  $fields=array('irszam'=>$irszam,'helyseg'=>$helyseg);
  if (!$van){
    db_insert('irszam')->fields($fields)->execute();
  } else {
    db_update('irszam')->fields($fields)->condition('id',$id,'=')->execute();
  }
}

function pi_wf_webform_select_options_info() {
  //module_load_include('inc','pi_wf','pi_wf_select_list');
  $items = array();
  $items['iskolak'] = array(
  	'title' => t('Iskolák'),
  	'options callback' => '_pi_wf_iskolak',
  );
  $items['helysegek'] = array(
  	'title' => t('Helységek'),
  	'options callback' => '_pi_wf_helysegek',
  );
  $items['om_azonositok'] = array(
  	'title' => t('OM azososítók'),
  	'options callback' => '_pi_wf_om_azonositok',
  );
  $items['iskolakodok']=array(
  	'title' => t('Iskolakódok'),
  	'options callback' => '_pi_wf_iskolakodok',
  );
  /*
  $items['megyek'] = array(
  	'title' => t('Megyék'),
  	'options callback' => '_pi_wf_megyek',
  );
  */
  $items['fenntartok'] = array(
  	'title' => t('Fenntartók'),
  	'options callback' => '_pi_wf_fenntartok',
  );
  return $items;
}
//---------------------------
//ajax
function _pi_wf_iskolak_full_ajax($om_azonosito=null){
  $data=_pi_wf_iskolak_full($om_azonosito);
  $y=null;
  if (isset($data)){
    $y = json_encode($data);
  }
  header('Content-Type: application/json');
  echo $y;
  exit;
}

function _pi_wf_iskolak_full($om_azonosito=null){
  $sql="select i.id,i.om_azonosito,i.iskolakod,i.intezmeny_neve,irszam.irszam,irszam.helyseg from {iskola} i join {irszam} on (i.irszam_id=irszam.id)";
  if ($om_azonosito){
    $sql.=" where om_azonosito='$om_azonosito'";
  }
  $results=db_query($sql);
  foreach($results as $result){
    //dpm($result);
    $a[]=$result;
  }
  return $a;  
}

function _pi_wf_iskolak(){
  $a=_pi_wf_iskolak_filt();
  return $a;
}

function _pi_wf_iskolak_filt($irszam_id=null){
  $sql="select i.id,i.om_azonosito,i.iskolakod,i.intezmeny_neve,i.irszam_id,irszam.irszam,irszam.helyseg from {iskola} i join {irszam} on (i.irszam_id=irszam.id)";
  if ($irszam_id and is_numeric($irszam_id)){
    dpm($irsz_id,'_pi_wf_iskolak:irszam_id');
    $sql.=' where irszam.id='.$irszam_id;
  }
  $sql.=' order by intezmeny_neve';
  $a=array();
  $results=db_query($sql);
  foreach($results as $result){
    //dpm($result);
    $a[$result->om_azonosito]=$result->intezmeny_neve.' (OM:'.$result->om_azonosito.')('.$result->irszam.' '.$result->helyseg.')' ;
  }
  return $a;
}

//---------------
function _pi_wf_helysegek(){
  $sql="select id,irszam,helyseg from {irszam} order by helyseg,irszam";
  $a=array();
  $results=db_query($sql);
  foreach($results as $result){
    //dpm($result);
    $a[$result->id]=$result->helyseg.' ('.$result->irszam.')';
  }
  return $a;
}

//------------------------------
function _pi_wf_om_azonositok(){
  $a=_pi_wf_om_azonositok_filt();
  return $a;
}

function _pi_wf_om_azonositok_filt($irszam_id=null){
  $a=_pi_wf_iskolak_filt($irszam_id);
  ksort($a);
  $b=array_keys($a);
  $a=array();
  foreach($b as $c){
    $a[$c]=$c;
  }
  return $a;
}

function _pi_wf_iskolakodok(){
  $a=_pi_wf_iskolakodok_filt();
  return $a;
}

function _pi_wf_iskolakodok_filt($om_azonosito=null){
  $sql="select i.id,i.iskolakod from {iskola} i";
  if ($om_azonosito){
    $sql.=" where om_azonosito='$om_azonosito'";
  }
  $a=array();
  $results=db_query($sql);
  foreach($results as $result){
    $a[$result->id]=$result->iskolakod;
  }
  return $a;
}

//ajax
function _pi_wf_iskola_filter($irszam_id){
  dpm($irszam_id,'_pi_wf_iskola_filter:irszam_id');
  $data=_pi_wf_iskolak_filt($irszam_id);
  dpm($data);
  //$y=drupal_json_output($data);
  $y=null;
  if (isset($data)){
    $y = json_encode($data);
  }
  header('Content-Type: application/json');
  echo $y;
  exit;
  //return $id.':'.print_r($y;);
}

function _pi_wf_iskola_search_om($om_azonosito){
  $sql="SELECT i.*,t.tid FROM {iskola} i 
join {megye} m on i.megye_id=m.id
join {taxonomy_term_data} t on m.megye collate utf8_general_ci=t.name and t.vid=12
where i.om_azonosito='$om_azonosito'";
  $results=db_query($sql);
  foreach($results as $result){
    break;
  }
  return $result;
}

//ajax
function _pi_wf_iskola_search($id){
  dpm($id,'_pi_wf_iskola_search:id');
  $result=_pi_wf_iskola_search_om($id);
  $y=null;
  if (isset($result)){
    $y = json_encode($result);
  }
  
  header('Content-Type: application/json');
  echo $y;
  exit;
  
  //return $id.':'.print_r($y);
}
/*
//nem kell, mert van helyette a megye szótár
function _pi_wf_megyek(){
  $sql="select id,megye from {megye} order by id";
  $results=db_query($sql);
  $a=array();
  foreach($results as $result){
    $a[$result->id]=$result->megye;
  }
  return $a;
}
*/
function _pi_wf_fenntartok(){
  $sql="select f.id,f.nev,f.tipus_id,ft.tipus from {fenntarto} f join {fenntarto_tipus} ft on (f.tipus_id=ft.id) order by f.nev";
  $results=db_query($sql);
  $a=array();
  foreach($results as $result){
    $a[$result->id]=$result->nev.' ('.$result->tipus.')';
  }
  return $a;
}

function _pi_wf_fenntarto_search_id($id){
  $sql="SELECT f.*,t.tid uj_megye_id,td.tid uj_tipus_id 
FROM {fenntarto} f 
join {megye} m on f.megye_id=m.id 
join {taxonomy_term_data} t on m.megye collate utf8_general_ci=t.name and t.vid=12 
join {fenntarto_tipus} ft on f.tipus_id=ft.id 
join {taxonomy_term_data} td on ft.tipus collate utf8_general_ci=td.name and td.vid=10 
where f.id=$id";
  $results=db_query($sql);
  foreach($results as $result){
    break;
  }
  return $result;
}

//ajax
function _pi_wf_fenntarto_search($id){
  dpm($id,'_pi_wf_fenntarto_search:id');
  $result=_pi_wf_fenntarto_search_id($id);
  $y=null;
  if (isset($result)){
    $y = json_encode($result);
  }
  
  header('Content-Type: application/json');
  echo $y;
  exit;
  
  //return $id.':'.print_r($y);
}

function _pi_wf_irszam_search_irszam($irszam){
  $sql="SELECT i.* 
FROM {irszam} i 
where i.irszam='$irszam'";
  $results=db_query($sql);
  foreach($results as $result){
    break;
  }
  return $result;
}

function _pi_wf_irszam_search($irszam){
  dpm($irszam,'_pi_wf_irszam_search:irszam');
  $result=_pi_wf_irszam_search_irszam($irszam);
  $y=null;
  if (isset($result)){
    $y = json_encode($result);
  }
  
  header('Content-Type: application/json');
  echo $y;
  exit;
  
  //return $id.':'.print_r($y);
}

function _pi_wf_iskola_reg($om_azonosito){
  //dpm($submission);
  $nev='';
  //$om_azonosito=$submission->data[5][0];
  $sql="select intezmeny_neve from {iskola} where om_azonosito=$om_azonosito";
  $results=db_query($sql);
  foreach($results as $result){
    $nev=$result->intezmeny_neve;
    break;
  }
  //$sql="update {iskola} set regisztralt=1 where om_azonosito='$om_azonosito'";
  //$result=db_query($sql);
  $query=db_update('iskola')->fields(array('regisztralt'=>1))->condition('om_azonosito',$om_azonosito);
  $rows=$query->execute();
  dpm($rows);
  drupal_set_message($om_azonosito.': '.$nev.' - Az intézmény regisztrálva!');
}

function _pi_wf_level_tanaroknak($submission){
  $om_azonosito=$submission->data[5][0];
  $sql="select sid from {webform_submitted_data} where nid=135 and cid=5 and data=$om_azonosito";
  $results=db_query($sql);
  $sid=null;
  //most az utolsót vesszük, ha kipucoltuk, akkor csak 1 marad
  foreach($results as $result){
    $sid=$result->sid;
  }
  if ($sid){
    $nid=152;
    $sql="select * from {webform_submitted_data} where nid=135 and cid=42 and sid=$sid";
    $results=db_query($sql);
    foreach($results as $result){
      $data=unserialize($result->data);
      foreach($data as $key=>$value){
        if (is_array($value)){
          $email=$value[3];
          if ($email){
            _pi_wf_send_mail_reg($nid,$email);
          }       
        }
      }
    }
  }
}
/*
function pi_wf_webform_render_matrix_alter(&$component, &$value, &$element) {
  dpm($component,'pi_wf_webform_render_matrix_alter:component');
  dpm($value,'pi_wf_webform_render_matrix_alter:value');
  dpm($element,'pi_wf_webform_render_matrix_alter:element');
}
*/

function _pi_wf_ig_email($om_azonosito){    
  $nid=135;
  $sql="select sid from {webform_submitted_data} where nid=$nid and cid=5 and data='$om_azonosito'";
  $results=db_query($sql);
  foreach($results as $result){
    $sid=$result->sid;
  }
  module_load_include('inc','webform','includes/webform.submissions');
  $submission=webform_get_submission($nid, $sid);
  $email=$submission->data[11][0];
  return $email;
}

function _pi_iskola_szurt_reg(&$form,$teszt=0){
  if (!$teszt){
    $isk=$om=$helyseg=array();
    $sql="select i.om_azonosito,i.intezmeny_neve,i.irszam_id,irszam.irszam,irszam.helyseg".
      " from {iskola} i join {irszam} on (irszam.id=i.irszam_id)".
      " where i.regisztralt is null and i.gimnazium='X' or i.szakkozep='X' or szakiskolai_nevelesoktatas='X' or spec_szakiskola='X'".
      " order by irszam.helyseg,i.intezmeny_neve";
    $results=db_query($sql);
    foreach($results as $result){
      $isk[$result->om_azonosito]=$result->intezmeny_neve.' (OM:'.$result->om_azonosito.')('.$result->irszam.' '.$result->helyseg.')';
      $om[$result->om_azonosito]=$result->om_azonosito;
      $helyseg[$result->irszam_id]=$result->helyseg.' ('.$result->irszam.')';
    }
    //dpm($form,'_pi_iskola_szurt_reg:form');
    $form['submitted']['iskola']['iskola']['#options']=$isk;
    $form['submitted']['iskola']['om_azonosito']['#options']=$om;  
    $form['submitted']['iskola']['helyseg']['#options']=$helyseg;
    //dpm($form,'_pi_iskola_szurt_reg:form:after');
  }
}

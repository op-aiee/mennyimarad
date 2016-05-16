<?php
function _pi_wf_eredmeny($nid,$sid){
  module_load_include('inc','webform','includes/webform.submissions');
  //dpm($nid);
  //dpm($sid);
  //drupal_set_message('Az oldal fejlesztés alatt!','status',false);
  $submission = webform_get_submission($nid, $sid);
  $goto=null;
  dpm($submission);
  switch($nid){
    case 7: //Mennyit fogsz ma költeni?
      $terv=$submission->data[9][0];
      $email=$submission->data[8][0];
      $koltes=$submission->data[15][0];
      $hol='koltes';
      if (!$koltes){
        if (!$email){
          $goto='/node/67';
        } else {
          $goto='/node/66';
        }
      }
      break;
    case 22:  //Sacc per kábé
      $terv=$submission->data[2][0];
      $email=$submission->data[1][0];
      $koltes=$submission->data[3][0];
      $hol='kosar';
      if (!$koltes){
        if (!$email){
          $goto='/node/69';
        } else {
          $goto='/node/68';
        }
      }
      break;
    case 36:  //Mennyit költöttél ma?
      $terv=$submission->data[6][0];
      $jatek=$submission->data[5][0];
      $hol=($jatek==7 ? 'koltes' : 'kosar');
      $koltes=$submission->data[1][0];
      break;
    case 94:  // 	Pénzügyi személyiségteszt
      $eredmeny=_pi_wf_teszteredmeny($submission);
      $sz=_pi_wf_teszteredmeny_szoveg($eredmeny);
      $goto='node/95/nid/94/sid/'.$sid;
      break;
  }
  if ($goto){
    drupal_goto($goto);
  }
  if ($terv==$koltes){
    $url="tipp/$hol/helyes";
    $szaz=0;
  } elseif ($terv<$koltes){
    $szaz=abs(round((($koltes*100)/$terv)-100,1));
    if (0<=$szaz and $szaz<10){
      $url="tipp/$hol/helyes";
    } elseif (10<=$szaz and $szaz<30){
      $url="tipp/$hol/kozel";
    } else {
      $url="tipp/$hol/rossz";
    }
  } else {
    $szaz=abs(round(100-(($koltes*100)/$terv),1));
    if (0<=$szaz and $szaz<10){
      $url="tipp/$hol/helyes";
    } elseif (10<=$szaz and $szaz<30){
      $url="tipp/$hol/jo";
    } else {
      $url="tipp/$hol/alul";
    }
  }
  drupal_goto('/'.$url,array('query'=>array("szaz"=>$szaz)));
}

function pi_wf_cron(){
  _pi_wf_send_mail();
  //echo '<p>megy<>';
}
  
function _pi_wf_load_submission(){
  $sql="
SELECT from_unixtime(ws.submitted) submitted,wd.* 
FROM {webform_submitted}_data wd
join {webform_submissions} ws using (nid,sid)
where wd.nid in (7,22)
	and from_unixtime(ws.submitted)>
	  concat(date_format(adddate(curdate(),-1),'%Y-%m-%d'),'18:00:01')
  and wd.sid in (
    select wd2.sid 
    from {webform_submitted_data} wd2
    join {webform_submissions} ws2 using (nid,sid)
    where wd2.nid in (7,22)
		  and from_unixtime(ws2.submitted)>
	      concat(date_format(adddate(curdate(),-1),'%Y-%m-%d'),'18:00:01')
      and wd2.cid=if(wd2.nid=7,8,1) 
      and data<>''
  )
	and wd.sid not in (
	  select wd1.sid 
    from {webform_submitted_data} wd1
    join {webform_submissions} ws1 using (nid,sid)
    where wd1.nid in (7,22)
		  and from_unixtime(ws1.submitted)>
	      concat(date_format(adddate(curdate(),-1),'%Y-%m-%d'),'18:00:01')
      and wd1.cid=if(wd1.nid=7,15,3) 
      and wd1.data>0
  )
order by wd.nid,wd.sid
;";
  $results=db_query($sql);
  //dpm($results);
  return $results;
}

function _pi_wf_hide_title_head_tag_need(){
  $arr=array();
  $hide=array('goto','tipp');
  $sql="SELECT substr(source,6) nid FROM {url_alias} where alias like '{$hide[0]}/%' or alias like '{$hide[1]}/%'";
  $results=db_query($sql);
  foreach($results as $rec){
    $arr[]=$rec->nid;
  }
  return $arr;
}

function _pi_wf_send_mail(){
  global $base_url;
  $headers=_pi_wf_mailheader();
  _pi_wf_req_o();
  $arr=array(
     7=>array(
      'jatek'=>'Mennyit fogsz ma költeni',
      'link'=>'/mennyit-koltottel-ma?jatek=7',
      'szoveg'=>'[osszeg] forint kiadást saccoltál a mai napra; most nézzük, mekkora pontossággal sikerült eltalálnod az összeget!</p><p></p><p>A linkre kattintva megadhatod, mekkora lett a pénzügyi tervezőben vezetett kiadások összege valójában:<br />',
      'url'=>$base_url,
    ),
    22=>array(
      'jatek'=>'Sacc per kábé',
      'link'=>'/mennyit-koltottel-ma?jatek=22',
      'szoveg'=>'A vásárlás előtt összesen [osszeg] forintos kiadásra számítottál.</p><p></p><p>A linkre kattintva megadhatod, mennyit fizettél ténylegesen:<br />',
      'url'=>$base_url,
    ),
  );
  $hol='itt';
  $level=_pi_wf_load_template(161);
  $body=$level['body'];
  $path=drupal_get_path('module','pi_wf');
  $results=_pi_wf_load_submission();
  foreach($results as $result){
    switch($result->nid){
      case 7:
        $arr[$result->nid][$result->sid][($result->cid==8 ? 'email' : 'ertek')]=$result->data;
        break;
      case 22:
        $arr[$result->nid][$result->sid][($result->cid==1 ? 'email' : 'ertek')]=$result->data;
        break;
    }
    if (isset($arr[7][$result->sid]['ertek']) and $arr[7][$result->sid]['ertek']>0){
      $osszeg=$arr[7][$result->sid]['ertek'];
      $b=str_replace(
        array('[szoveg]','[osszeg]','[jatek]','[link]','[url]'),
        array(
          $arr[7]['szoveg'],
          $osszeg,
          $arr[7]['jatek'],
          '<a href="'.$base_url.$arr[7]['link'].'&tipp='.$osszeg.'">'.$base_url.$arr[7]['link'].'&tipp='.$osszeg.'</a>',
          $arr[7]['url'],
        ),
        $body
      );
      dpm($b,'módosított levél body');
      $mail=drupal_mail(
        'pi_wf',
        $hol,
        $arr[7][$result->sid]['email'],
        language_default(),
        array(
          'body'=>$b,
          'subject'=>"Pénziránytű költés tipp ({$arr[7]['jatek']})",
          'headers'=>$headers,
        ),
        variable_get('site_mail')
      );
      dpm($mail);
      $arr[7][$result->sid]['mail']=$mail;
    } elseif (isset($arr[22][$result->sid]['ertek']) and $arr[22][$result->sid]['ertek']>0){
      $osszeg=$arr[22][$result->sid]['ertek'];
      $b=str_replace(
        array('[szoveg]','[osszeg]','[jatek]','[link]','[url]'),
        array(
          $arr[22]['szoveg'],
          $osszeg,
          $arr[22]['jatek'],
          '<a href="'.$base_url.$arr[22]['link'].'&tipp='.$osszeg.'">'.$base_url.$arr[22]['link'].'&tipp='.$osszeg.'</a>',
          $arr[22]['url'],
        ),
        $body
      );
      dpm($b,'módosított levél body');
      $mail=drupal_mail(
        'pi_wf',
        $hol,
        $arr[22][$result->sid]['email'],
        language_default(),
        array(
          'body'=>$b,
          'subject'=>"Pénziránytű költés tipp ({$arr[22]['jatek']})",
          'headers'=>$headers
        ),
        variable_get('site_mail')
      );
      dpm($mail);
      $arr[22][$result->sid]['mail']=$mail;
    }   
  }
  //dpm($arr);
}



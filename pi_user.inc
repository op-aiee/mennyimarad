<?php
function _pi_wf_redirect_after_password($uid=null){
  $arr=array();
  if ($uid){
    $user=user_load($uid);
  } else {
    global $user;
    //$user=user_load()
  }
  //dpm($user);
  $nid=null;
  $arr=$user->roles;
  //dpm($arr);
  //return $arr;  
  foreach($arr as $rid =>$rolename){
    //$rolename=$role->name;
    switch($rid){
      case 9: //igazgato
        $nid=164; //Igazgató megerősítette a regisztrációt
        break;
      case 10:  //tanár
        $nid=166; //Tanár megerősítette a regisztrációt
        break;
      case 12:  //igazgató-hírlevél
        $nid=165; // 	Igazgató megerősítette a regisztrációt - hírlevél
        break;
    }
  }
  return $nid;
}

// user profile form
function pi_wf_form_user_profile_form_alter(&$form, $form_state, $form_id) {
  $form['#submit'][] = '_pi_wf_user_profile_form_submit';
}

function _pi_wf_user_profile_form_submit($form, &$form_state) {
  global $user;
  $url='';
  $nid=_pi_wf_redirect_after_password();
  if ($nid){
    //$created=$user->created;
    $login=$user->login;
    $access=$user->access;
    if ($access==$login and ($user->created)<=86400){  //one-time-login
      $url='node/'.$nid;
    }
  }
  drupal_goto($url);  
}

function _pi_wf_create_user($user,$role){
  $sql="select rid,name from {role} where name='$role'";
  $results=db_query($sql);
  foreach($results as $result){
    $rid=$result->rid;
    break;
  }
  $account=user_load_by_name($user['loginnev']);
  if (!$account and $user['loginnev'] and $user['email']){
    $password = user_password(8); 
    //set up the user fields
    $fields = array(
      'name' => $user['loginnev'],
      'mail' => $user['email'],
      'pass' => $password,
      'signature_format' => 'full_html',
      'language' => 'hu',
      'timezone' => 'Europe/Budapest',
      'status' => 1,
      'init' => $user['email'],
      'roles' => array(
        DRUPAL_AUTHENTICATED_RID => 'authenticated user',
        $rid=>$role,
      ),
    ); 
    //the first parameter is left blank so a new user is created
    $account = user_save('', $fields);
    $account->password = $fields['pass']; 
    // Send the e-mail through the user module.
    /*
    drupal_mail(
      'user','register_no_approval_required',$user['email'],NULL,
      array('account' => $account),
      variable_get('site_mail','noreply@penziranytu.hu')
    );
    */
  } else {
    drupal_set_message('Nincs megadva a loginnév vagy az e-mailcím');
  }
}

// a reg utáni jelszómegadásnál eltűnik a szerkesztés,megjelenítés tab
function pi_wf_menu_local_tasks_alter(&$data, $router_item, $root_path) {
  dpm($data,'pi_wf_menu_local_tasks_alter:data');
  dpm($router_item,'pi_wf_menu_local_tasks_alter:router_item');
  dpm($root_path,'pi_wf_menu_local_tasks_alter:root_path');
  global $user;
  //print_r($user);  
  $roles=array('igazgató','tanár','diák');
  $kell=false;
  foreach($roles as $role){
    if (in_array($role,$user->roles)){
      $kell=true;
      break;
    }
  }  
  if ($kell){
    //print_r($data);
    foreach($data['tabs'] as $key1=>$values1){
      foreach($values1['output'] as $key2=>$values2){
        switch($values2['#link']['path']){
          case "user/%/edit":
          case "user/%/view":
            unset($data['tabs'][$key1]['output'][$key2]);
            break;
        }
      }
    }
  }
}

/*
function pi_user_menu_alter(&$items) {
  $items['user/%/edit']['type'] = MENU_CALLBACK;
}
*/


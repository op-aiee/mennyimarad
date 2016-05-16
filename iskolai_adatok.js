(function($){
  $(document).ready(function(){
    $('#edit-submitted-regi-om-azonosito').change(function(){
      var regi_om_azonosito=$('#edit-submitted-regi-om-azonosito').val();
      var arr={'om_azonosito':'om-azonosito','intezmeny_neve':'intezmeny-neve','megye_id':'megye','irszam_id':'iranyitoszam','cim':'cim',
        'alt_isk':'iskola-tipusa-1','gimnazium':'iskola-tipusa-2','szakkozep':'iskola-tipusa-3','szakiskolai_nevelesoktatas':'iskola-tipusa-4',
        'spec_szakiskola':'iskola-tipusa-5',
        'alt_isk_db':'stat-adatok-altalanos-iskola','gimnazium_db':'stat-adatok-gimnazium','szakkozep_db':'stat-adatok-szakkozepiskola',
        'szakiskola_db':'stat-adatok-szakiskola','spec_szakiskola_db':'stat-adatok-specialis-szakiskolaiskola',
        'fenntarto_id':'fenntarto',
        'vezeto':'vezeto-vezeto-neve','telefon':'vezeto-vezeto-telefonja','fax':'vezeto-vezeto-fax-szama','email':'vezeto-vezeto-e-mail-cime',
        'kepviselo':'kepviselo-kepviselo-neve','kepviselo_telefon':'kepviselo-kepviselo-telefonja',
        'kepviselo_fax':'kepviselo-kepviselo-fax-szama','kepviselo_email':'kepviselo-kepviselo-e-mail-cime',
        'tid':'megye'
      };
      $.getJSON("/iskola/om/"+regi_om_azonosito, function( data ) {
        var s='';
        $.each(data,function(key,val){
          var key1='#edit-submitted-'+arr[key];
          //s=s+key1+':'+val+'<br />';
          
          switch(key){
            case 'alt_isk':
            case 'gimnazium':
            case 'szakkozep':
            case 'szakiskolai_nevelesoktatas':
            case 'spec_szakiskola':
              if (val=='X'){
                $(key1).prop('checked',true);
              }
              break;
            case 'megye': //helyette van a tid
              brak;
            case 'tid':
              $(key1).val('tid_'+val);
              break;
            default:
              $(key1).val(val);
              break;
          }
          
        });
        //alert(s);
      }); 
    });      
  });
})(jQuery);
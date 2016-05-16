(function($){
  $(document).ready(function(){
    $('#edit-submitted-fenntarto-azonositoja').change(function(){
      var id=$('#edit-submitted-fenntarto-azonositoja').val();
      var arr={'id':'fenntarto-azonositoja','nev':'fenntarto-neve','uj_tipus_id':'fenntarto-tipusa','uj_megye_id':'megye','irszam_id':'iranyitoszam','cim':'cim'
      };
      $.getJSON("/fenntarto/"+id,function(data){
        //var s='';
        $.each(data,function(key,val){
          var key1='#edit-submitted-'+arr[key];
          //s=s+key1+':'+val+'<br />';          
          switch(key){
            case 'uj_megye_id':
            case 'uj_tipus_id':
              $(key1).val('tid_'+val);
              break;
            case 'megye_id':
            case 'tipus_id':
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
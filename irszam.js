(function($){
  $(document).ready(function(){
    $('#edit-submitted-iranyitoszam').change(function(){
      var irszam=$('#edit-submitted-iranyitoszam').val();
      var arr={'irszam':'iranyitoszam','helyseg':'helyseg'};
      $.getJSON("/irszam/"+irszam,function(data){
        //var s='';
        $.each(data,function(key,val){
          var key1='#edit-submitted-'+arr[key];
          //s=s+key1+':'+val+'<br />';
          $(key1).val(val);
        });
        //alert(s);
      }); 
    });      
  });
})(jQuery);
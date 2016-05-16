(function($){
  $(document).ready(function(){
    var helyseg_orig=$('#edit-submitted-iskola-helyseg option');
    var om_orig=$("#edit-submitted-iskola-om-azonosito option");
    var iskola_orig=$("#edit-submitted-iskola-iskola option");
    $('#edit-submitted-iskola-helyseg').change(function(){
      var helyseg_id=$('#edit-submitted-iskola-helyseg').val();
      if (helyseg_id){
        //alert('url="/iskola/'+helyseg_id+'"');
        $.getJSON("/iskola/"+helyseg_id, function( data ) {
          var items=[];
          var s='';
          $("#edit-submitted-iskola-om-azonosito").empty();
          $("#edit-submitted-iskola-iskola").empty();
          $.each(data,function(key,val){
            //s=s+key+','+val+';'+String.charCodeAt(13)+String.charCodeAt(13);
            $("#edit-submitted-iskola-om-azonosito")
              .append($("<option />").attr("value",key).text(key));
            $("#edit-submitted-iskola-iskola")
              .append($("<option />").attr("value",key).text(val));
          });
        });
      } else {
        $('#edit-submitted-iskola-helyseg').empty();
        $.each(helyseg_orig,function(key,val){
          $('#edit-submitted-iskola-helyseg')
            .append($("<option />").attr("value",key).text(val.label));
        });
        $("#edit-submitted-iskola-om-azonosito").empty();
        $.each(om_orig,function(key,val){
          $('#edit-submitted-iskola-om-azonosito')
            .append($("<option />").attr("value",key).text(val.label));
        });
        $("#edit-submitted-iskola-iskola").empty();
        $.each(iskola_orig,function(key,val){
          $('#edit-submitted-iskola-iskola')
            .append($("<option />").attr("value",key).text(val.label));
        });
      }
    });
    $('#edit-submitted-iskola-om-azonosito').change(function(){
      var om_id=$('#edit-submitted-iskola-om-azonosito').val();
      //alert(om_id);
      $('#edit-submitted-iskola-iskola option:selected').prop('selected',false);
      $('#edit-submitted-iskola-iskola option[value="'+om_id+'"]').prop('selected',true);
    });
    $('#edit-submitted-iskola-iskola').change(function(){
      var om_azonosito=$('#edit-submitted-iskola-iskola').val();
      $('#edit-submitted-iskola-om-azonosito').val(om_azonosito);
    });
    $('input[id^="edit-submitted-jelentkezes-minden-tanev-"],input[id^="edit-submitted-jelentkezes-az-elkovetkezo-ket-tanevben-"]')
      .change(function(){
      var num=$('input:checked[id^="edit-submitted-jelentkezes-minden-tanev-"],input:checked[id^="edit-submitted-jelentkezes-az-elkovetkezo-ket-tanevben-"]')
        .length;
      if (num>=5){
        $('#edit-submitted-nem-tudok-a-fentiekbol-otot-vallalni-2').prop('checked',true);
        $('.webform-component--nem-tudok-a-fentiekbol-otot-vallalni').hide();
      } else {
        $('.webform-component--nem-tudok-a-fentiekbol-otot-vallalni').show();
        $('#edit-submitted-nem-tudok-a-fentiekbol-otot-vallalni-1').prop('checked',true);
      }
    });
  });
})(jQuery);

(function($){
  var nap=-1;
  var beker=0;
  var szamertek_elozo;
  $(document).ready(function(){
    $('fieldset.webform-component--tabla').hide();
    $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').on('change blur',function(){
      var fizetes=parseInt($('input[id="edit-submitted-tabla-kasszak-fizetes"]').val());
      var ossz=0;
      $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').each(function(){
        var val=parseInt($(this).val()) || 0;
        ossz+=val;        
      });
      $('#edit-submitted-tabla-kasszak-osszesen').val(ossz);          
      if (ossz>fizetes){
        alert('A kasszák összege nagyobb, mint a fizetés!');
      } else if (ossz!=fizetes){
        alert('A kasszák összege nem egyenlő a fizetéssel!');
      }
    });
    //indulásnál számolja az összesent
    $('input[id="edit-submitted-tabla-kasszak-kasszak-csop-kassza1"]').blur();
    $('#tovabb').click(function(){
      if (beker==0){
        nap++;
      } else {
        beker=2;
      }
      if (nap==0){
        $('#jatek_leiras').hide();
        $('fieldset.webform-component--tabla').show();
        $('fieldset.webform-component--tabla--jatekter').hide();
      } else {
        if (nap==31){
          alert('A játéknak vége! Gratulálunk, sikeresen teljesítetted a feladatot!');          
          window.location.href ='/mennyi-marad-zsebedben';
          return;
        }
        //bábu kiírás
        $('#babu').css('position','absolute').css('top',813).css('left',26+(nap-1)*26);
        if (nap>1 && beker<2){
          var fizetes=parseInt($('#edit-submitted-tabla-kasszak-fizetes').val());
          var kasszassz=aSz[nap-1][0];
          szamertek=szamertek_elozo;
          var kasszaertek=parseInt($('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val());
          var megtakertek=parseInt($('#edit-submitted-tabla-kasszak-kasszak-csop-kassza5').val());
          if (aSz[nap-1][0]==0){
            fizetes+=szamertek;
            $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes);
            $('fieldset.webform-component--tabla--jatekter').hide();
            beker=1;
          } else if (((nap-1) % 10)==0){
            $('fieldset.webform-component--tabla--jatekter').hide();
            beker=1;
          } else {
            if (kasszaertek-szamertek>=0){
              $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes-szamertek);
              $('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val(kasszaertek-szamertek).trigger('change');
            } else if (megtakertek-szamertek+kasszaertek>=0){
              $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes-szamertek);
              $('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val(0);
              $('#edit-submitted-tabla-kasszak-kasszak-csop-kassza5').val(megtakertek-szamertek+kasszaertek).trigger('change');
            } else {
              alert('Kiestél!');
              window.location.href ='/mennyi-marad-zsebedben';
              return;
            }            
          }
        } else {
          beker=0;
        }
        if (beker==0){
          $('fieldset.webform-component--tabla--jatekter').show();
          $('#nap').text(nap);
          //szöveg
          var sz=aSz[nap][1];
          var szam=Math.ceil(Math.random()*3);
          var szamertek=aSz[nap][1+szam];
          szamertek_elozo=szamertek;
          $('#szoveg').html('<p>'+sz.replace('<szam>','<span class="auto">'+szamertek+'</span>')+'</p>');
        } 
      }
    });
  });
})(jQuery)

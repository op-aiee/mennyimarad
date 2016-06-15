(function($){
  var nap=-1;
  var beker=0;
  var szamertek_elozo;
  $(document).ready(function(){
    $('fieldset.webform-component--tabla').hide();
    function kasszakosszesen(){
      var ossz=0;
      $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').each(function(){
        var val=parseInt($(this).val()) || 0;
        ossz+=val;        
      });
      $('#edit-submitted-tabla-kasszak-osszesen').val(ossz);
      return (ossz);
    }
    function kasszaellenorzes(){
      var hiba=0;
      var fizetes=parseInt($('input[id="edit-submitted-tabla-kasszak-fizetes"]').val());
      var ossz=kasszakosszesen();
      if (ossz>fizetes){
        alert('A kasszák összege nagyobb, mint a fizetés!');
        hiba=1;
      } else if (ossz!=fizetes){
        alert('A kasszák összege nem egyenlő a fizetéssel!');
        hiba=1;
      }
      return hiba;
    }
    $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').on('change blur',function(){
      kasszakosszesen();
    });
    //indulásnál számolja az összesent
    kasszaellenorzes();
    $('#tovabb').click(function(){
      if (beker==0){
        if (nap==0 && kasszaellenorzes()==1){
            return;
        }
        nap++;
      } else {
        if (kasszaellenorzes()==1){
          return;
        };
        beker=2;
      }
      if (nap==0){
        $('#jatek_leiras').hide();
        $('.webform-component--tabla--kasszak--uj-bevetel').hide();
        $('#szoveg').hide();
        $('fieldset.webform-component--tabla--jatekter').hide();
        $('fieldset.webform-component--tabla').show();
        $('div.webform-component--tabla--kasszak--kassza-leiras').text(aV[0]);
      } else {
        //bábu kiírás
        //$('#babu').css('position','absolute').css('top',1610).css('left',247+(nap-1)*60);
        $('.webform-component--tabla--szoveg').show();
        if (nap>1 && beker<2){
          var fizetes=parseInt($('#edit-submitted-tabla-kasszak-fizetes').val());
          var kasszassz=aSz[nap-1][0];
          szamertek=szamertek_elozo;
          var kasszaertek=parseInt($('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val());
          var megtakertek=parseInt($('#edit-submitted-tabla-kasszak-kasszak-csop-kassza5').val());
          if (aSz[nap-1][0]==0){
            fizetes+=szamertek;
            $('.webform-component--tabla--kasszak--uj-bevetel').show();
            $('#edit-submitted-tabla-kasszak-uj-bevetel').val(szamertek);
            $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes).prop('disabled',false);
            $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',false);
            $('fieldset.webform-component--tabla--jatekter').hide();
            $('.webform-component--tabla--szoveg').hide();
            $('div.webform-component--tabla--kasszak--kassza-leiras').text(aV[0]);
            var gombtext='Szétosztottam a bevételt';
            $('#tovabb').text(gombtext);
            beker=1;
          } else if (((nap-1) % 10)==0){
            $('fieldset.webform-component--tabla--jatekter').hide();
            $('div.webform-component--tabla--kasszak--kassza-leiras').text(aV[nap-1]);
            $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',false);
            $('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',false);
            var gombtext='Szétosztottam a fizetést';
            $('#tovabb').text(gombtext);
            $('.webform-component--tabla--szoveg').hide();
            beker=1;
          } else {
            $('.webform-component--tabla--szoveg').show();
            $('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',true);
            $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',true);
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
          $('.webform-component--tabla--kasszak--uj-bevetel').hide();
          $('#edit-submitted-tabla-kasszak-uj_bevetel').val(0);
          $('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',true);
          $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',true);
          beker=0;
        }
        if (nap==31){
          alert('A játéknak vége! Gratulálunk, sikeresen teljesítetted a feladatot!');          
          window.location.href ='/mennyi-marad-zsebedben';
          return;
        }
        if (beker==0){
          $('fieldset.webform-component--tabla--jatekter').show();
          $('#nap').text(nap).html('<img src="/sites/default/files/jatekok/mennyimarad/gamebg/gamebg'+nap+'.png"/>');
          //szöveg
          var kasszassz=aSz[nap][0];
          var gombtext=(kasszassz==0 ? 'Szétosztom a bevételt' : 'Kifizetem '+aK[kasszassz]+' zsebből')
          var sz=aSz[nap][1];
          var szam=Math.ceil(Math.random()*3);
          var szamertek=aSz[nap][1+szam];          
          szamertek_elozo=szamertek;
          $('#tovabb').text(gombtext);
          $('#szoveg').show().html('<h3>'+nap+'. nap</h3>'+'<img class="napikon" src="/sites/default/files/jatekok/mennyimarad/napok/mezo'+nap+'.png"/>'+'<p class"napitext">'+sz.replace('<szam>','<span class="auto">'+szamertek+'</span>')+'</p>');
        } 
      }
    });
  });
})(jQuery)

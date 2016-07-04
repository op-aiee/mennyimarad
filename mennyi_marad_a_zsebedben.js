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
        jAlert('A kasszák összege nagyobb, mint a fizetés! Ellenőrizd a költségvetési terved!', 'Csak óvatosan!');
        hiba=1;
      } else if (ossz!=fizetes){
        jAlert('A kasszák összege nem egyenlő a fizetéssel! Ellenőrizd a költségvetési terved!', 'Figyelem');
        hiba=1;
      }
      return hiba;
    }
    $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').on('change blur',function(){
      kasszakosszesen();
    });
    var div='<div id="2gomb szoveg">Egyik zsebben kevés és túl sok a másikban? Most korrigálhatsz!<br/><button id="modosit" type="button" class="hideit">Módosítom a tervet!</button><button id="nextstep" type="button" class="nextstep">Jó a tervem, inkább tovább lépek!</button></div>';
    $('.webform-component--tovabb').append(div);
    $('#2gomb').hide();
    $('#modosit').click(function(){
      $('#modosit').hide();
    });
    $('#nextstep').click(function(){
      $('#tovabb').click().show();
      $('#2gomb').hide();
    });

    //indulásnál számolja az összesent
    //kasszaellenorzes();
    fizetes=150000;
    $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes).prop('disabled',true);
    $('#edit-submitted-tabla-kasszak-uj-bevetel').prop('disabled',true);
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
        $('#edit-submitted-tabla-kasszak-osszesen').prop('disabled',true);
      } else {
        //bábu kiírás
        //$('#babu').css('position','absolute').css('top',1610).css('left',247+(nap-1)*60);
        $('.webform-component--tabla--szoveg').show();
        //$('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',true);
        $('.webform-component--tabla--kasszak--fizetes').hide();
        if (nap>1 && beker<2){
          var fizetes=parseInt($('#edit-submitted-tabla-kasszak-fizetes').val());
          var kasszassz=aSz[nap-1][0];
          var kasszanev=aK[kasszassz];
          szamertek=szamertek_elozo;
          var kasszaertek=parseInt($('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val());
          var megtakertek=parseInt($('#edit-submitted-tabla-kasszak-kasszak-csop-kassza5').val());
          if (aSz[nap-1][0]==0){
            fizetes+=szamertek;
            $('.webform-component--tabla--kasszak--uj-bevetel').show();
            $('#edit-submitted-tabla-kasszak-uj-bevetel').val(szamertek);
            $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes);
            $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',false);
            $('fieldset.webform-component--tabla--jatekter').hide();
            $('.webform-component--tabla--szoveg').hide();
            $('div.webform-component--tabla--kasszak--kassza-leiras').text(aV[0]);
            var gombtext='Szétosztottam a bevételt';
            $('#tovabb').text(gombtext);
            beker=1;
          } else {
            $('.webform-component--tabla--szoveg').show();
            //$('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',true);
            $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',true);
            if (kasszaertek-szamertek>=0){
              $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes-szamertek);
              $('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val(kasszaertek-szamertek).trigger('change');
            } else if (megtakertek-szamertek+kasszaertek>=0){
              jAlert('Vigyázz! '+kasszanev+'-kasszád kiürült, ezért csak a megtakarításodból tudtad rendezni a tartozásod. Ha ez is elfogy, nagy bajban leszel!', 'Csak óvatosan!');
              $('#edit-submitted-tabla-kasszak-fizetes').val(fizetes-szamertek);
              $('#edit-submitted-tabla-kasszak-kasszak-csop-kassza'+kasszassz).val(0);
              $('#edit-submitted-tabla-kasszak-kasszak-csop-kassza5').val(megtakertek-szamertek+kasszaertek).trigger('change');
            } else {
              jAlert('„Minden zsebed kiürült és még a megtakarításod is elfogyott. Valószínűleg nem jól osztottad be a pénzed. Kattints az OK-ra és kezdd újra a játékot!','Kiestél! :(');
              window.location.href ='/mennyi-marad-zsebedben';
              return;
            }            
          }
          if (((nap-1) % 10)==0){
            $('#2gomb').show();
            $('#modosit').show();
            $('fieldset.webform-component--tabla--jatekter').hide();
            $('div.webform-component--tabla--kasszak--kassza-leiras').text(aV[nap-1]);
            $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',false);
            //$('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',false);
            var gombtext='Kész a tervem, tobább lépek';
            $('#tovabb').text(gombtext).hide();
            $('.webform-component--tabla--szoveg').hide();
            beker=1;
          } else {
            $('#tovabb').show();
            $('#2gomb').hide();
          }
        } else {
          $('.webform-component--tabla--kasszak--uj-bevetel').hide();
          $('#edit-submitted-tabla-kasszak-uj_bevetel').val(0);
          //$('#edit-submitted-tabla-kasszak-fizetes').prop('disabled',true);
          $('input[id^="edit-submitted-tabla-kasszak-kasszak-csop-kassza"]').prop('disabled',true);
          beker=0;
        }
        if (nap==31){
          jAlert('A játéknak vége! Gratulálunk, sikeresen teljesítetted a feladatot!', 'Gratulálunk!');          
          window.location.href ='/mennyi-marad-zsebedben';
          return;
        }
        if (beker==0){
          $('fieldset.webform-component--tabla--jatekter').show();
          $('#nap').text(nap).html('<img src="/sites/default/files/jatekok/mennyimarad/gamebg/gamebg'+nap+'.png"/>');
          //szöveg
          var sz=aSz[nap][1];
          var szam=Math.ceil(Math.random()*3);
          var szamertek=aSz[nap][1+szam];          
          szamertek_elozo=szamertek;
          var kasszassz=aSz[nap][0];
          var gombtext=(kasszassz==0 ? 'Szétosztom a bevételt' : (szamertek==0 ? 'Tovább' : 'Kifizetem '+aK[kasszassz]+' zsebből'));
          $('#tovabb').text(gombtext);
          $('#szoveg').show().html('<h3>'+nap+'. nap</h3>'+'<img class="napikon" src="/sites/default/files/jatekok/mennyimarad/napok/mezo'+nap+'.png"/>'+'<p class"napitext">'+sz.replace('<szam>','<span class="auto">'+szamertek+'</span>')+'</p>');
        } 
      }
    });
  });
})(jQuery)

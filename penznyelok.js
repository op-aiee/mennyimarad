var arr={
'1':{'havi': 15000,
  'rizsa':'A számlaegyenleged is felérhet egy feketelevessel. Ha napi egy, drágán vásárolt kávé helyett inkább otthon főzöl magadnak, havonta [havi], évente [eves], tíz év alatt pedig akár [10_eves]-ot is megtakaríthatsz.'
  },  //KV
'2':{'havi': 3600,
  'rizsa':'A kis kiadások is számítanak. Ha napi egy szelet csokival együtt nem majszolod el a pénzed is, <br />egy hónapban [havi], egy év alatt [eves], tíz év alatt pedig [10_eves]-tal több marad nálad.'
  },  //Csoki
'3':{'havi': 12000,
  'rizsa':'A túlzott pörgés nem csak az egészségednek, de a pénztárcádnak is árt. Napi két doboz energiaital árából havonta [havi], évente [eves], tíz év alatt [10_eves]-ot takaríthatsz meg.'
  },  //Energiaital
'4':{'napi': 1000,
  'rizsa':'Az erős dohányosok vagyonokat füstölnek el. Ha nem vásárolsz minden nap egy doboz cigit, havi [havi], <br />évi [eves], tíz év alatt pedig [10_eves]-ot spórolhatsz.'
  },  //Dohány
'5':{'havi': 8000,
  'rizsa':'A szépségápolás terén kifejezetten nem a mennyiség a meghatározó. Ha csak a valóban szükséges kozmetikumokra költesz, és nem vásárolsz minden héten új kencét, havonta [havi], évente [eves], tíz év alatt [10_eves]-ot spórolhatsz.'
  },  //Kozmetikum
'6':{'heti':2500,
  'rizsa':'Heti [heti] forint felesleges kiadás elkerülésével egy hónapban [havi], egy évben [eves], míg tíz év alatt akár [10_eves]-tal többet rakhatsz félre.'
  },  //Apróság
'7':{'eves':115000,
  'rizsa':'Az otthoni általában féláron kihozható, és sokszor finomabb is. Ha naponta egyetlen adag készételt otthon főzöttre cserélsz, havonta [havi], évente [eves], tíz év alatt pedig [10_eves]-ot takaríthatsz meg így.'
  },  //Menza
'8':{'napi':1000,
  'rizsa':'Autóval közlekedni ­– különösen nagyvárosban ­– idő és pénzkidobás. Benzin és fenntartási költségek helyett a tömegközlekedést választva egy hónapban akár [havi], egy év alatt [eves], tíz év alatt [10_eves]-tal több marad nálad.'
  },  //Autó
'9':{'eves':120000,
  'rizsa':'Nem muszáj mindenhol ott lenni. Két nagyobb hazai fesztivál költségeinek megtakarításával egy hónapra vetítve [havi], egy évben [eves], tíz év alatt [10_eves]-ot spórolhatsz.'
  },  //Fesztivál
'A':{'havi':6000,
  'rizsa':'A fizikum mesterséges felpumpálása arányos a pénztárca leeresztésével. Már heti két protein ital vagy teljesítménynövelő árából havonta [havi], éves szinten [eves], tíz év alatt pedig [10_eves]-ot takaríthatsz meg.'
  },  //Protein
'B':{'heti':1125,
  'rizsa':'A szerencse forgandó, és többnyire inkább a Ház, mint a játékos javára forog. Már heti két sorsjegy árának megtakarításával havonta [havi], évente [eves], tíz év alatt [10_eves]-tal több marad a zsebedben.'
  },  //Szerencsejáték
'C':{'heti': 900,
  'rizsa':'Érdemes átgondolni, mire van szükséged valójában. Heti három felesleges lap vagy magazin árából <br />egy hónapban [havi], évente [eves], tíz év alatt akár [10_eves]-ot rakhatsz félre.'
  },  //Magazin
'D':{'havi':20000,
  'rizsa':'A buli hevében könnyen kifolyhat a kezedből a pénz. Ha nem költesz el minden második hétvégén tízezer forintot, havonta [havi], évente [eves], tíz év alatt pedig [10_eves]-ot spórolhatsz.'
  },  //Szórakozás
'E':{'havi':18000,
  'rizsa':'A lustaságnak ára van: ha heti két rendelés helyett inkább magadra főzöl, egy hónap alatt [havi], egy év alatt [eves], tíz év alatt [10_eves]-ot takaríthatsz meg.'
  },  //Pizza
'F':{'havi':12000,
  'rizsa':'Míg a ruhásszekrényt telezsúfolod, a bankszámlád kiürül. Heti egy olcsóbb ruha ára havonta [havi], <br />évente [eves], tíz év alatt [10_eves] megtakarítást jelenthet.'
  },  //Ruhák
'G':{'havi':10000,
  'rizsa':'A cipőkkel kapcsolatban is érdemes két lábbal a földön járni. Egy középkategóriás cipő árából <br />havonta [havi], évente [eves], tíz év alatt [10_eves]-ot tehetsz félre.'
  },  //Cipő
'H':{'havi':4000,
  'rizsa':'Minden vásárlásnál célszerű csak azt venni, amire szükséged van.  Ha egy hónapban csak egy vásárlás nagyjából <br />[havi]-os többletköltségét megspórolod, az évente [eves], tíz év alatt [10_eves]-ot jelenthet.'
  },  //Online
'I':{'havi':8000,
  'rizsa':'Se Neked, se a gyerekeknek nem jó, ha úgy érzik, mindent megkaphatnak. Hetente egy egyszerűbb, vagy havonta egy középkategóriás játék árának megtakarítása egy hónapban [havi], egy évben [eves], <br />tíz év alatt [10_eves]-ot jelenthet a családnak.'
  } //Játék
};

(function($){
  $(document).ready(function() {
    $('#webform-client-form-8 .form-checkbox').each(function(){
      var n,h,m,y,y10;
      var kod=$(this).val();
      var kod1=(kod<10 ? kod : kod.charCodeAt(0)-55);
      if (arr[kod]['napi']){
        n=arr[kod]['napi'];
        y=n*365;
        m=Math.round(y/12,0);
        h=Math.round(y/52,0);
      } else {
        if (arr[kod]['heti']){
          h=arr[kod]['heti'];
          y=h*52;
          m=Math.round(y/12,0);
        } else {
          if (arr[kod]['havi']){
            m=arr[kod]['havi'];
            y=m*12;
            h=Math.round(y/52);
          } else {
            if (arr[kod]['eves']){
              y=arr[kod]['eves'];
              h=Math.round(y/52,0);
              m=Math.round(y/12,0);
            }
          }
        }
      }
      y10=y*10;
      var divdata='<div id="edit-submitted-draga-kiadasok-'+kod+'-info" class="info">';
      //divdata+='<span>Napi:&nbsp;</span><span class="int" id="napi_'+kod+'"></span>';
      //divdata+='<span>Heti:&nbsp;</span><span class="int" id="heti_'+kod+'"></span>';
      var rizsa=arr[kod]['rizsa']
      .replace('[heti]','</span><span class="int autoft" id="heti_'+kod+'"></span><span>')
      .replace('[havi]','</span><span class="int autoft" id="havi_'+kod+'"></span><span>')
      .replace('[eves]','</span><span class="int autoft" id="eves_'+kod+'"></span><span>')
      .replace('[10_eves]','</span><span class="int autoft" id="eves10_'+kod+'"></span><span>');
      divdata+='<span>'+rizsa+'</span>';
      divdata+='</div>';
      $("label[for='edit-submitted-draga-kiadasok-"+kod1+"']").after(divdata);
      //$('#napi_'+kod).text(n1);
      $('#heti_'+kod).text(h);
      $('#havi_'+kod).text(m);
      $('#eves_'+kod).text(y);
      $('#eves10_'+kod).text(y10);
    });
    $("label[for='edit-submitted-draga-kiadasok']").css('margin-bottom','10px');
    $('.info').css('margin-left','50px').toggle();
    $('#osszesen').hide();
    $('#webform-client-form-8 .form-checkbox').change(function(){
      var kod=$(this).val();
      $('#edit-submitted-draga-kiadasok-'+kod+'-info').toggle();
      Osszesit();
      $('.#webform-client-form-8  #osszesen').show();
      //$('#edit-submitted-draga-kiadasok-'+kod+'-info').text($('#edit-submitted-draga-kiadasok-'+kod+'-info').text().replace(' -','-'));
    });
    //autoNumericSetup['aSign']=' Ft';
    //$('#webform-client-form-8 .auto').autoNumeric('init',autoNumericSetup).css('text-align','right').css('white-space','nowrap');
    $('#webform-client-form-8 .autoft').autoNumeric('init',autoNumericSetupFt).css('text-align','right').css('white-space','nowrap').css('font-weight','bold');

    function Osszesit(){
      var n,h,m,y,y10;
      var m_o=0,y_o=0,y10_o=0;
      $('#webform-client-form-8 .form-checkbox').each(function(){
        if ($(this).is(':checked')){
          var kod=$(this).val();
          if (arr[kod]['napi']){
            n=arr[kod]['napi'];
            y=n*365;
            m=Math.round(y/12,0);
            h=Math.round(y/52,0);
          } else {
            if (arr[kod]['heti']){
              h=arr[kod]['heti'];
              y=h*52;
              m=Math.round(y/12,0);
            } else {
              if (arr[kod]['havi']){
                m=arr[kod]['havi'];
                y=m*12;
                h=Math.round(y/52);
              } else {
                if (arr[kod]['eves']){
                  y=arr[kod]['eves'];
                  h=Math.round(y/52,0);
                  m=Math.round(y/12,0);
                }
              }
            }
          }
          y10=y*10;
          m_o+=m;
          y_o+=y;
          y10_o+=y10
        }
      });
      //$('#napi_o').text(n1).autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      //$('#heti_o').text(h1).autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      $('.webform-component--osszesen span#havi_o').text(m_o);
      $('.webform-component--osszesen span#eves_o').text(y_o);
      $('.webform-component--osszesen span#eves10_o').text(y10_o);
      $('.webform-component--osszesen span#havi_o').autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      $('.webform-component--osszesen span#eves_o').autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      $('.webform-component--osszesen span#eves10_o').autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
    }
  });
})(jQuery);


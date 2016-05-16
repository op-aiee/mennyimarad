(function($){
  $(document).ready(function(){
    function forduloszov(lap){
      var fordulok={1:'elso',2:'masodik',3:'harmadik'}
      return fordulok[lap];
    }
    
    function tetmegad(lap,ii){
      jj=(lap-1)*10+ii;
      var fordulo=forduloszov(lap);
      $('#edit-submitted-'+fordulo+'-fordulo-tet-'+jj).change(function(){
        if ($(this).val()<1){
          alert('Negatív szám vagy 0 nem adható meg!');
          return;
        }
        if ($(this).val()>megt){
          alert('Maximum '+megt+' adható meg!');
          return;
        }
        hiba=($(this).val()!==parseInt($(this).val()).toString());
        if (hiba){
          alert('Csak számokat lehet beírni!');
          return;
        }
        $(this).prop('disabled',true);
        var name=$(this).prop('name');
        var x=name.substr(name.indexOf('tet_')+4);
        var jj=x.substr(0,x.indexOf(']'));
        var ii=(jj%10==0? 10 : jj%10);
        var lap=Math.floor((jj-1)/10)+1;
        var fordulo=forduloszov(lap);
        Szamol(lap,'t',jj);
      });
    }
  
    function ertekeles(lap){
      var db=0;
      for(i in kiertekeles[lap]){
        db++;
        var felt=kiertekeles[lap][i]['vizsgalat'];
        if (eval(megt+felt)){
          var szov=kiertekeles[lap][i]['ertek'];
          $('#indok_'+lap+'10').after('<center><div class="ertekeles">Értékelés:<br /><div class="ikon ikon_'+lap+'_'+db+'"></div><div>'+szov+'</div></div></center>');
          break;
        }
      }
      return db;
    }
    
    function Szamol(lap,melyik,ii){
      var fordulo=forduloszov(lap);
      megt=lapmegtak(lap);
      for(ssz=1;ssz<11;ssz++){
        var jo_valasz=valaszok[lap][ssz]['valasz'];
        var valasz=$('input[name="submitted['+fordulo+'_fordulo]['+lap+ssz+'_kerdes]"]:checked').val();
        var jj=(lap-1)*10+ssz;
        var tet=parseInt($('#edit-submitted-'+fordulo+'-fordulo-tet-'+jj).val());
        tet=(tet ? tet : 0);
        if (valasz){
          var w=valasz.toUpperCase().charCodeAt(0)-64;
          if (valasz==jo_valasz){
            if (ssz==ii){
              $('#valasz_'+jj).addClass('ikon ikon_'+lap+'_2')
                .after('<div style="background-color:green;" class="valasz">Gratulálunk,jó válasz!</div>');
              $('label[for="edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes-'+w+'"]').css('background-color','green').css('color','white');
            }
            megt=megt+tet;
          } else {
            if (ssz==ii){
              $('#valasz_'+jj).addClass('ikon ikon_'+lap+'_1')
                .after('<div style="background-color:red;" class="valasz">Sajnos elvesztetted a tétet!</div>');
              $('label[for="edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes-'+w+'"]').css('background-color','red').css('color','white');
              w=jo_valasz.toUpperCase().charCodeAt(0)-64;
              $('label[for="edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes-'+w+'"]').css('background-color','green').css('color','white');
            }
            megt=megt-tet;
            if (megt<=0){
              alert('Elfogyott a megtakarításod!\nKiestél a játékból!\nAz OK gombra kattintva újrakezdheted a fordulót!');
              var url=$(location).attr('href');
              $(location).attr('href',url);
            }
          }
        } else {
          megt=megt-tet;
        }
      }
      $('.megt').text(megt);
      $('input[name="submitted[lap_megt_'+lap+']"').val(megt);
    }
    
    function tet(lap,ii){
      var fordulo=forduloszov(lap);
      var ssz=(ii%10==0 ? 10 : ii%10);
      var jj=(lap-1)*10+ssz;
      var indok=valaszok[lap][ssz]['indok'];
      $('.form-item-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes:last')
        .after('<center><div id="valasz_'+jj+'" class="valasz_ikon"></div></center><div id="indok_'+lap+ssz+'" class="indok">'+indok+'</div>')
      $('#indok_'+lap+ssz).hide();
      if (ii<10){
        $('#indok_'+lap+ssz)
          .after('<div id="tovabb_'+ssz+'" class="gomb">Következő</div>');
        $('#tovabb_'+ssz).click(function(){
          var id=$(this).prop('id');
          var ssz=parseInt(id.substr(7));
          var jj=(lap-1)*10+ssz;
          var kovssz=ssz+1;
          var kovjj=jj+1;
          $('.webform-component--'+fordulo+'-fordulo--tet-'+jj).hide();
          $('.webform-component--'+fordulo+'-fordulo--'+lap+ssz+'-kerdes').hide();
          $('#tovabb_'+ssz).hide();
          $('.webform-component--'+fordulo+'-fordulo--tet-'+kovjj).show();
          $('.webform-component--'+fordulo+'-fordulo--'+lap+kovssz+'-kerdes').show();
          //$('#edit-submitted-'+fordulo+'-fordulo-'+lap+kovssz+'-kerdes').hide();
          $('#tovabb_'+kovssz).show();
        });
      }
      if (ii>1){
        var jj=(lap-1)*10+ii;
        $('.webform-component--'+fordulo+'-fordulo--tet-'+jj).hide();
        $('.webform-component--'+fordulo+'-fordulo--'+lap+ssz+'-kerdes').hide();
        $('#tovabb_'+ii).hide();
      }
      $('input[name="submitted['+fordulo+'_fordulo]['+lap+ssz+'_kerdes]"]').change(function(){
        $(this).prop('disabled',true);
        var name=$(this).prop('name');
        var lap=parseInt(name.substr(name.indexOf('][')+2,1));
        var x=name.substr(name.indexOf('][')+3);
        var ssz=parseInt(x.substr(0,x.indexOf('_kerdes')));
        Szamol(lap,'k',ssz);
        $('#indok_'+lap+ssz).show();
        if (ssz==10){
          $('.megtak').after('<div class="gomb vege">'+(lap<3 ? 'Tovább' : 'Kilépés a játékból')+'</div>');
          $('.vege').click(function(){
            if ($(this).hasClass('db_1')){
              var url=$(location).attr('href');
              //alert('Újra:'+url);              
            } else {
              var kovlap=lap+1;
              switch(kovlap){
                case 2:
                  var node='/node/176';
                  break;
                case 3:
                  var node='/node/177';
                  break;
                case 4:
                  var node='/';
                  break;
              }
              url=node;
              //alert('Következő lap:'+url);
            }
            $(location).attr('href',url);
          });
          db=ertekeles(lap);
          $('.vege').addClass('db_'+db);
          if (db==1){
            $('.vege').text('Újrakezdés');
          }
        }
      });
    }
    
    function lapmegtak(lap){
      var indulo={1:100,2:50,3:10}
      var megt=indulo[lap];
      return megt;
    }
    
    //---------------------------------------------
    var valaszok,kiertekeles,megt,fordulo,lap,ssz;
    $.getJSON("/jatek/oktober/szovegek",function(data){
      valaszok=data['valaszok'];
      kiertekeles=data['kiertekeles'];
      lap=parseInt($('input[name="submitted[lap]"]').val());
      megt=lapmegtak(lap);
      fordulo=forduloszov(lap);
      $('.webform-component--'+fordulo+'-fordulo--'+lap+'10-kerdes')
        .after('<div class="megtak">Megtakarításod:&nbsp;<span class="megt"></span>&nbsp;pont</div>');      
      $('.megt').text(megt);
      $('input[type="submit"]').hide();
      for(ssz=1;ssz<11;ssz++){
        tetmegad(lap,ssz);
        tet(lap,ssz);
      }
    });
  });
})(jQuery);
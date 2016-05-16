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
        var name=$(this).prop('name');
        var x=name.substr(name.indexOf('tet_')+4);
        var jj=x.substr(0,x.indexOf(']'));
        var ii=(jj%10==0? 10 : jj%10);
        var lap=Math.floor((jj-1)/10)+1;
        var fordulo=forduloszov(lap);
        Szamol(lap);
        $('#edit-submitted-'+fordulo+'-fordulo-'+lap+ii+'-kerdes').show();
        /*
        megt=megt-$(this).val();
        $('.megt').text(megt);
        if (megt<=0){
          alert('Elfogyott a megtakarításod!');
        }
        */
      });
    }
    
    function ertekeles(lap){
      Szamol(lap);
      for(i in kiertekeles[lap]){
        var felt=kiertekeles[lap][i]['vizsgalat'];
        if (eval(megt+felt)){
          var szov=kiertekeles[lap][i]['ertek'];
          $('#indok_'+lap+'10').after('<div class="ertekeles">Értékelés:<br />'+szov+'</div>');
          break;
        }
      }      
    }
    
    function Szamol(lap){
      var fordulo=forduloszov(lap);
      lapmegtak(lap);
      for(ssz=1;ssz<11;ssz++){
        var jo_valasz=valaszok[lap][ssz]['valasz'];
        var valasz=$('input[name="submitted['+fordulo+'_fordulo]['+lap+ssz+'_kerdes]"]:checked').val();
        var jj=(lap-1)*10+ssz;
        var tet=parseInt($('#edit-submitted-'+fordulo+'-fordulo-tet-'+jj).val());
        tet=(tet ? tet : 0);
        if (valasz){
          var w=valasz.toUpperCase().charCodeAt(0)-64;
          if (valasz==jo_valasz){
            $('label[for="edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes-'+w+'"]').css('background-color','green').css('color','white');
            megt=megt+2*tet;
          } else {
            megt=megt-tet;
            $('label[for="edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes-'+w+'"]').css('background-color','red').css('color','white');
            w=jo_valasz.toUpperCase().charCodeAt(0)-64;
            $('label[for="edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes-'+w+'"]').css('background-color','green').css('color','white');
            if (megt<=0){
              alert('Elfogyott a megtakarításod! Kiestél a játékból!');
            }
          }
        } else {
          megt=megt-tet;
        }
      }
      $('.megt').text(megt);
      //$('#lap_megt_'+lap).val(megt);
      $('input[name="submitted['+fordulo+'_fordulo][lap_megt_'+lap+']"').val(megt);
    }
    
    function tet(lap,ii){
      var fordulo=forduloszov(lap);
      var ssz=(ii%10==0 ? 10 : ii%10);
      var indok=valaszok[lap][ssz]['indok'];
      $('.form-item-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes:last')
        .after('<div id="indok_'+lap+ssz+'" class="indok">'+indok+'</div>');
      $('#indok_'+lap+ssz).hide();
      if (ii>1){
        var jj=(lap-1)*10+ii;
        $('.webform-component--'+fordulo+'-fordulo--tet-'+jj).hide();
        $('.webform-component--'+fordulo+'-fordulo--'+lap+ssz+'-kerdes').hide();
        $('.megtak:eq(1)').hide();
      } else {
        $('#edit-submitted-'+fordulo+'-fordulo-'+lap+ssz+'-kerdes').hide();
      }
      $('input[name="submitted['+fordulo+'_fordulo]['+lap+ssz+'_kerdes]"]').change(function(){
        var name=$(this).prop('name');
        var lap=parseInt(name.substr(name.indexOf('][')+2,1));
        var x=name.substr(name.indexOf('][')+3);
        var ssz=parseInt(x.substr(0,x.indexOf('_kerdes')));
        Szamol(lap);
        $('#indok_'+lap+ssz).show();
        if (ssz==10){
          ertekeles(lap);
        } else {
          var jj=(lap-1)*10+ssz;
          var kovssz=ssz+1;
          var kovjj=jj+1;
          $('.webform-component--'+fordulo+'-fordulo--tet-'+kovjj).show();
          $('.webform-component--'+fordulo+'-fordulo--'+lap+kovssz+'-kerdes').show();
          $('#edit-submitted-'+fordulo+'-fordulo-'+lap+kovssz+'-kerdes').hide();
          switch (kovssz){
            case 6:
              $('.megtak:eq(1)').show();
              break;
          }
        }
      });
    }
    
    function lapmegtak(lap){
      switch(lap){
        case 1:
          megt=100;
          //$('<input>').attr({'type':'hidden','id':'lap_megt_1','name':'lap_megt_1','value':megt}).appendTo('form');
          $('input[name="submitted[elso_fordulo][lap_megt_1]"').val(megt);
          break;
        case 2:
          //megt=$('#lap_megt_1').val();
          megt=10;
          //$('<input>').attr({'type':'hidden','id':'lap_megt_2','name':'lap_megt_2','value':megt}).appendTo('form');
          $('input[name="submitted[masodik_fordulo][lap_megt_2]"').val(megt);
          break;
        case 3:
          //megt=$('#lap_megt_2').val();
          megt=10;
          //$('<input>').attr({'type':'hidden','id':'lap_megt_3','name':'lap_megt_3','value':megt}).appendTo('form');
          $('input[name="submitted[elso_fordulo][lap_megt_1]"').val(megt);
          break;
      }
    }
    
    //---------------------------------------------
    var valaszok,kiertekeles,megt,fordulo,lap,ssz;
    $.getJSON("/jatek/oktober/szovegek",function(data){
      valaszok=data['valaszok'];
      kiertekeles=data['kiertekeles'];
      lap=parseInt($('input[name="details[page_num]"]').val());
      lapmegtak(lap);
      fordulo=forduloszov(lap);
      $('.webform-component--'+fordulo+'-fordulo--cel'+lap+',.webform-component--'+fordulo+'-fordulo--'+lap+'10-kerdes,.webform-component--'+fordulo+'-fordulo--'+lap+'5-kerdes')
        .after('<div class="megtak">Megtakarításod:&nbsp;<span class="megt"></span>&nbsp;pont</div>');
      
      $('.megt').text(megt);
      for(ssz=1;ssz<11;ssz++){
        tetmegad(lap,ssz);
        tet(lap,ssz);
      }
    });
  });
})(jQuery);
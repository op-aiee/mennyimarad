(function($){
  $(document).ready(function() {    
    Elokeszito();
    $('#rizsa').hide();
    $('.osszeg').bind('change blur focusout',function(){
      Szamol();
    });
    $(document).ajaxComplete(function() {
      Elokeszito();
      Szamol();
      $('.osszeg').bind('change blur focusout',function(){
        Szamol();
      });
    });    
  });

  function Elokeszito(){
    i=0;
    var rows=$('#edit-penznyelo-0-table').find('tr').length;
    $('#edit-penznyelo-0-table').find('tr').each(function(){
      if (i==0){
        $(this).find('th').eq(1).css('padding-right','0px').attr('colspan',2);
        $(this).find('th').eq(2).remove();
        $(this).find('th').eq(3).attr('width','150');
      } else {
        if (i<rows-1) {
          //$(this).find('td').eq(-1).attr('align','right');
          $('select[name="submitted[penznyelo]['+i+'][2]"]').addClass('osszeg');
          $('input[name="submitted[penznyelo]['+i+'][3]"]').addClass('int osszeg').val(1);
          $('input[name="submitted[penznyelo]['+i+'][4]"]').addClass('int osszeg');
          $(this).find('td').eq(4).addClass('gomb');                         //0-tól indexelődik,az 5.kell
          $('input[name="submitted[penznyelo]['+i+'][6]"]').addClass('int auto').attr('disabled','disabled'); //havi
          $('input[name="submitted[penznyelo]['+i+'][7]"]').addClass('int auto').attr('disabled','disabled'); //éves
          $('input[name="submitted[penznyelo]['+i+'][8]"]').addClass('int auto').attr('disabled','disabled'); //10 éves
        }
      }
      i++;
    });
    $('#edit-penznyelo-0-table .auto').autoNumeric('init',autoNumericSetup).css('text-align','right').css('white-space','nowrap');
    $('#edit-penznyelo-0-table .autoft').autoNumeric('init',autoNumericSetupFt).css('text-align','right').css('white-space','nowrap').css('font-weight','bold');
  }

  function Szamol(){
    var eves=0,havi=0,eves10=0;
    var eves_o=0,havi_o=0,eves10_o=0;
    var gy,o,a,i=0;
    var rows=$('#edit-penznyelo-0-table').find('tr').length;
    $('#edit-penznyelo-0-table').find('tr').each(function(){
      if (0<i && i<rows-1){
        gy=$('select[name="submitted[penznyelo]['+i+'][2]"] option:selected').val();
        a =parseInt($('input[name="submitted[penznyelo]['+i+'][3]"]').val().replace(/ /g,''));
        if (!a){
          return;
        }
        if (a>999){
          alert('Maximum 999 alkalom adható meg!');
          return;
        }
        o =parseInt($('input[name="submitted[penznyelo]['+i+'][4]"]').val().replace(/ /g,''));
        if (!o){
          return;
        }
        if (o>10000000){
          alert('Maximum 10 000 000 adható meg!');
          return;
        }
        o=(a ? a :1)*o;
        eves=0;
        switch(gy){
          case '1':
            eves=365*o;
            break;
          case '7':
            eves=52*o;
            break;
          case '30':
            eves=12*o;
            break;
          case '365':
            eves=o;
            break;
          case '3650':
            eves=o/10;
            break;
        }
        havi=Math.round(eves/12,0);
        if (havi>10000000){
          alert('A havi összeg rengeteg! (>10 000 000)');
          return;
        }
        havi_o+=havi;
        if (eves>120000000){
          alert('Az éves összeg rengeteg! (>120 000 000)');
          return;
        }
        eves_o+=eves;
        eves10=eves*10;
        if (eves10>1200000000){
          alert('A 10 éves összeg rengeteg! (>1 200 000 000)');
          return;
        }
        eves10_o+=eves10;
        $('input[name="submitted[penznyelo]['+i+'][6]"]').val(havi);
        $('input[name="submitted[penznyelo]['+i+'][7]"]').val(eves);
        $('input[name="submitted[penznyelo]['+i+'][8]"]').val(eves10);
        $('input[name="submitted[penznyelo]['+i+'][6]"]').autoNumeric('init',autoNumericSetup).autoNumeric('update',autoNumericSetup);
        $('input[name="submitted[penznyelo]['+i+'][7]"]').autoNumeric('init',autoNumericSetup).autoNumeric('update',autoNumericSetup);
        $('input[name="submitted[penznyelo]['+i+'][8]"]').autoNumeric('init',autoNumericSetup).autoNumeric('update',autoNumericSetup);
      }
      i++;
    });
    if (havi_o){
      $('#rizsa').show();
      $('span#havi_o1').text(havi_o);
      $('span#eves_o1').text(eves_o);
      $('span#eves10_o1').text(eves10_o);
      $('span#havi_o1').autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      $('span#eves_o1').autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      $('span#eves10_o1').autoNumeric('init',autoNumericSetupFt).autoNumeric('update',autoNumericSetupFt);
      //$('span#havi_o').text($('#havi_o').text()+' Ft');
      //$('span#eves_o').text($('#eves_o').text()+' Ft');
      //$('span#eves10_o').text($('#eves10_o').text()+' Ft');
    }
  }
  
})(jQuery.noConflict());




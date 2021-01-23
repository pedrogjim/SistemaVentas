import { Component, OnInit } from '@angular/core';
import { TileStyler } from '@angular/material/grid-list/tile-styler';
import { ServiceService } from "../../servicios/service.service";
declare var jQuery: any;

@Component({
  selector: 'app-reprecuperacionsemanalnac',
  templateUrl: './reprecuperacionsemanalnac.component.html',
  styleUrls: ['./reprecuperacionsemanalnac.component.css']
})
export class ReprecuperacionsemanalnacComponent implements OnInit {  
  
  constructor(private servicesService: ServiceService) { 
  }

  ngOnInit(): void {
  }

  datoscaptura ={
    fechaini:'',
    fechafin:''
  }

  selectReporte = {
    cCampos:null,cFrom:null,cWhere:null
  }
  repCobranzaCh=null;
  repCobranzaTb=null;  
  mostrarTablaCh:boolean=false;
  mostrarTablaTb:boolean=false;

  pagoPorCliente(){ 
    var fechainicial="";
    var fechafinal="";
    (function ($) {
      fechainicial= $("#txtfechaini").val();
      fechafinal= $("#txtfechafin").val();
    })(jQuery);
   
    this.selectReporte.cCampos = " Man.Cliente,Cli.Nombre as NomCliente,sum(Abo.Importe) as Importe ";
    this.selectReporte.cFrom = " Manifiestos Man Left Outer Join Abonos Abo on Man.id = Abo.idManifiesto Left Outer Join Clientes Cli on Cli.codigo = Man.Cliente";
    this.selectReporte.cWhere= " where fecha between '"+ fechainicial +"' and '"+fechafinal+"' and Man.Tipo = 'N' group by Man.Cliente,Cli.nombre";
    this.servicesService.selectParaReportes(this.selectReporte,'01').subscribe(result=>this.repCobranzaCh=result);
    
    setTimeout(() => {
      console.log(this.repCobranzaCh);
      if(this.repCobranzaCh[0]["Vacio"]==""){
        this.repCobranzaCh=null;
        this.mostrarTablaCh=false;
        console.log("No Arrojo Datos.")
      }else{
        this.mostrarTablaCh=true;
        this.sumaColumnas('tChaparral');
        this.pagoPorClienteTb();
      }      
    }, 500);
  }

  pagoPorClienteTb(){
    var fechainicial="";
    var fechafinal="";
    (function ($) {
      fechainicial= $("#txtfechaini").val();
      fechafinal= $("#txtfechafin").val();
    })(jQuery);
   
    this.selectReporte.cCampos = " Man.Cliente,Cli.Nombre as NomCliente,sum(Abo.Importe) as Importe ";
    this.selectReporte.cFrom = " Manifiestos Man Left Outer Join Abonos Abo on Man.id = Abo.idManifiesto Left Outer Join Clientes Cli on Cli.codigo = Man.Cliente";
    this.selectReporte.cWhere= " where fecha between '"+ fechainicial +"' and '"+fechafinal+"' and Man.Tipo = 'N' group by Man.Cliente,Cli.nombre";
    this.servicesService.selectParaReportes(this.selectReporte,'02').subscribe(result=>this.repCobranzaTb=result);
    
    setTimeout(() => {
      console.log(this.repCobranzaCh);
      if(this.repCobranzaTb[0]["Vacio"]==""){
        this.repCobranzaTb=null;
        this.mostrarTablaTb=false;
        this.sumartotaldebe();
      }else{
        this.mostrarTablaTb=true;
        this.sumaColumnas('tTombell');
        this.sumartotaldebe();
      }      
    }, 500);
  }

  sumaColumnas(pid){
    (function ($) {
      var total=0;
      $('table#'+pid+' tbody td:nth-child(3)').each(function(index) 
      {
        var res =parseFloat($(this).text().replace(/[$,]/gi,'')) ;  
        total+=res;
      });
      var totalformateado = new Intl.NumberFormat().format(total);
      $('table#'+pid+' tfoot th:nth-child(3)').text("$"+ totalformateado);
    })(jQuery);
      
    return true;
  }

  sumartotaldebe (){
    var total=0;
    (function ($) {
      if($('#tChaparral').is(':visible')){      
        $('table#tChaparral tfoot th:nth-child(3)').each(function(index) 
        {
          var res =parseFloat($(this).text().replace(/[$,]/gi,'')) ;  
          total += res;  
        });
      }
      if($('#tTombell').is(':visible')){
        $('table#tTombell tfoot th:nth-child(3)').each(function(index) 
        {
          var res =parseFloat($(this).text().replace(/[$,]/gi,'')) ;  
          total += res;  
        });
      }
      var totalformateado = new Intl.NumberFormat().format(total);
      $('table#tbltotaldeuda tfoot th:nth-child(4)').text("$"+ totalformateado);       
    })(jQuery);
  }

  llamarPdf(cParamId){
    var cTitulo = "Reporte Cobranza de la Semana."
    var fechainicial= "";
    var fechafinal= "";
    
    var options = { day: 'numeric',month: 'long', year: 'numeric' };
    (function ($) {
      fechainicial= $("#txtfechaini").val();
      fechafinal= $("#txtfechafin").val();
    })(jQuery);

    var cSubtitulo = "Periodo comprendido del "+fechainicial +" al "+fechafinal;
    this.servicesService.pdf(cParamId,cTitulo,cSubtitulo);
  }

}
 
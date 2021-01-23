import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import { ServiceService } from "../../servicios/service.service";
import {startWith, map} from 'rxjs/operators';

@Component({
  selector: 'app-repacumuladodeventas',
  templateUrl: './repacumuladodeventas.component.html',
  styleUrls: ['./repacumuladodeventas.component.css']
})
export class RepacumuladodeventasComponent implements OnInit {

  constructor(private servicesService: ServiceService) { }

  ngOnInit(): void {
    this.metodoProductor();
  }

  private _filtraProductor(value: string): ProductorInterface[] {
    const filterValue = value.toLowerCase();

    return this.productorInter.filter(state => state.nomcorto.toLowerCase().indexOf(filterValue) === 0);
  } 

  productorCtrl = new FormControl();
  filtrarProductor: Observable<ProductorInterface[]>;
  productorInter: ProductorInterface[] = [];
  resultado=null; 
  datoscaptura ={
    productor:'',
    fechaini:'',
    fechafin:''
  }

  metodoProductor(){
    this.buscaSelect.cCampos="codigo,TRIM(nomcorto) AS nomcorto";
    this.buscaSelect.cFrom= "productor";
    this.buscaSelect.cWhere="";
    this.servicesService.selectQuery(this.buscaSelect).subscribe(result=>this.resultado=result);
    setTimeout(()=>{
      this.productorInter=this.resultado;
      this.filtrarProductor = this.productorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(productor => productor ? this._filtraProductor(productor) : this.productorInter.slice())
      );
     },1000) 
   }
   buscaSelect ={
    cCampos:null, cFrom:null, cWhere:null
  }
  cachaProductor={
    codigo:null,nomcorto:null
  }   

}
export interface ProductorInterface  {
  codigo:string;
  nomcorto:string;
}

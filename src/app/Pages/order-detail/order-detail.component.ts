import { MainServiceService } from './../../services/main-service.service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { BaseController } from '../../base.controller';
import { DatePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DatePipe,MatIconButton],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent extends BaseController<any> {
  data:any
  constructor(public ActivatedRoute1:ActivatedRoute,public MainServiceService:MainServiceService){
    super();
  }
  async getOrderDetailsById(id:any){
    this.MainServiceService.isCustomControler = true
    this.MainServiceService.customController = 'order'
    const res= await (await this.MainServiceService.getDataById(id)).toPromise();
    this.MainServiceService.isCustomControler = false;
    this.MainServiceService.customController = ''

    if(!res.IsSuccessful) return this.showError(res.Errors)
      this.data  = res.Data

  }
  back(){
    this.navigate('order')
  }

  ngOnInit(){
    this.ActivatedRoute1?.params.subscribe((x:any)=>{
      if(x.id){
        this.getOrderDetailsById(x.id)

      }
    })


  }

}

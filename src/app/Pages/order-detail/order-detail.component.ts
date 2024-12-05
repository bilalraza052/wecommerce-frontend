import { MainServiceService } from './../../services/main-service.service';
import { ActivatedRoute } from '@angular/router';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseController } from '../../base.controller';
import { DatePipe } from '@angular/common';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DatePipe,MatIconButton,MatDialogTitle,MatDialogClose,MatDialogActions,MatDialogContent,MatIconModule,MatButtonModule,FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent extends BaseController<any> {
  data:any
  @ViewChild('updateStatus') updateStatus:TemplateRef<any> | undefined

  orderStatuses = [
    { id: 1, status: 'Received' },         // Order has been placed but not yet processed
    { id: 2, status: 'Processing' },      // Order is being prepared or packed
    { id: 3, status: 'Shipped' },         // Order has been shipped to the customer
    { id: 4, status: 'Out for Delivery' },// Order is out for delivery to the customer
    { id: 5, status: 'Delivered' },       // Order has been successfully delivered
    { id: 6, status: 'Completed' },       // Order is completed, customer has received it
    { id: 7, status: 'Returned' },        // Customer returned the order
    { id: 8, status: 'Canceled' },        // Order was canceled by the customer or store
    { id: 9, status: 'Refunded' },        // Order was refunded due to issues or customer request
    { id: 10, status: 'Failed' }          // Order failed (e.g., payment issue or shipping problem)
  ];
  id: any;
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
  openDialog(){
    this.model.id = this.id,
    this.model.orderStatus = this.data.orderStatus
    if(this.updateStatus){
      const dialogRef = this.dialog?.open(this.updateStatus,{
        width:'560px',
        maxWidth:'90vw',
      })
      dialogRef?.afterClosed().subscribe(x=>{
        this.model = {}
        this.getOrderDetailsById(this.id)
      })

    }

  }
  async update(){
    const res= await(await this.MainServiceService.Put(`order/${this.model.id}`,{
      ...this.model
    })).toPromise();
    if(!res.IsSuccessful) return this.showError(res.Errors);
    this.showError("Update Successfully");
    this.dialog?.closeAll()

  }

  ngOnInit(){
    this.ActivatedRoute1?.params.subscribe((x:any)=>{
      if(x.id){
        this.id = x.id
        this.getOrderDetailsById(x.id)

      }
    })


  }

}

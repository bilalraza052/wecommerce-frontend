import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MainServiceService } from '../../services/main-service.service';
import { BaseController } from '../../base.controller';
import { FormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FormsModule,MatDialogTitle,MatDialogClose,MatDialogActions,MatDialogContent,MatIconModule,MatButtonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent extends BaseController<any> {
  orders:any = [];
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
  @ViewChild('updateStatus') updateStatus:TemplateRef<any> | undefined
  
  searchValue:string=''
  async getOrderList(){
    const res= await(await this.service.getOrders({
      selector:'orderNumber,trackingNumber,orderStatus,firstName,lastName,address,total,address2,city,country,phone',
      searchValue:this.searchValue
    })).toPromise();
    if(!res.IsSuccessful) return this.showError(res.Errors)
      this.orders = res.Data
  }
  openDialog(order:any){
    this.model.id = order.id,
    this.model.orderStatus = order.orderStatus
    if(this.updateStatus){
      const dialogRef = this.dialog?.open(this.updateStatus,{
        width:'560px',
        maxWidth:'90vw',
      })
      dialogRef?.afterClosed().subscribe(x=>{
        this.model = {}
        this.getOrderList()
      })

    }

  }
  async update(){
    const res= await(await this.service.Put(`order/${this.model.id}`,{
      ...this.model
    })).toPromise();
    if(!res.IsSuccessful) return this.showError(res.Errors);
    this.showError("Update Successfully");
    this.dialog?.closeAll()

  }


  constructor(public service:MainServiceService){
    super();
  }
  ngOnInit(){
    this.getOrderList()
  }
}

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MainServiceService } from '../../services/main-service.service';
import { BaseController } from '../../base.controller';
import { FormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule,MatDialogTitle,MatDialogClose,MatDialogActions,MatDialogContent,MatIconModule,MatButtonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent extends BaseController<any> {
  categories:any[]=[]
  searchValue:string=''
  @ViewChild('form') form:TemplateRef<any> | undefined
  constructor(public service:MainServiceService){
    super()
  }
  openForm(data?:any){
    if(data){
      this.model = data

    }
    if(this.form){
      const dialog = this.dialog?.open(this.form,{
        width:'540px',
        maxWidth:'90vw'
      })
      dialog?.afterClosed().subscribe(x=>{
        this.model = {}
        this.getOrderList()
      })

    }
  

  }
  async deleteCategory(id:any){
    this.service.isCustomControler = true;
    this.service.customController ='categories'
    const res= await(await this.service.Delete(id)).toPromise();
    this.service.isCustomControler = false;
    this.service.customController = ''
    if(!res.IsSuccessful) return this.showError(res.Errors);
    this.showError("Delete Successfully");
    this.getOrderList()


  }
  async update(){
    this.service.isCustomControler = true;
    this.service.customController ='categories'
    const res= await(await this.service.save(this.model,this.model && this.model.id ? `${this.model.id}` : null)).toPromise();
    this.service.isCustomControler = false;
    this.service.customController = ''
    if(!res.IsSuccessful) return this.showError(res.Errors);
    this.showError("Transaction Successfully");
    this.dialog?.closeAll()

  }

  async getOrderList(){
    const res= await(await this.service.getCategory({
      selector:'name,parent_id',
      searchValue:this.searchValue
    })).toPromise();
    if(!res.IsSuccessful) return this.showError(res.Errors)
      this.categories = res.Data
  }
  ngOnInit(){
    this.getOrderList()
  }
}

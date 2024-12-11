import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseController } from '../../base.controller';
import { MainServiceService } from '../../services/main-service.service';
import { FormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule,MatDialogTitle,MatDialogClose,MatDialogActions,MatDialogContent,MatIconModule,MatButtonModule],

  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent extends BaseController<any> {
  product:any[]=[]
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
  onFileSelect(event:any){
    this.model.files = []
    for(let i = 0; i<event.target.files.length;i++){
      this.model.files.push(event.target.files[i])
    }
  }
  async deleteCategory(id:any){
    this.service.isCustomControler = true;
    this.service.customController ='product'
    const res= await(await this.service.Delete(id)).toPromise();
    this.service.isCustomControler = false;
    this.service.customController = ''
    if(!res.IsSuccessful) return this.showError(res.Errors);
    this.showError("Delete Successfully");
    this.getOrderList()


  }
  async update(){
    this.service.isCustomControler = true;
    this.service.customController ='product';
    if(this.model.files && this.model.files.length>0){
      this.model.image  = []
      for(let i = 0; i<this.model.files.length; i++){
      
          this.model.image.push(await this.convertFileToBase64(this.model.files[i]))
          
      
      }
 
    }
    const res= await(await this.service.save(this.model,this.model && this.model.id ? `${this.model.id}` : null)).toPromise();
    this.service.isCustomControler = false;
    this.service.customController = ''
    if(!res.IsSuccessful) return this.showError(res.Errors);
    this.showError("Transaction Successfully");
    this.dialog?.closeAll()

  }
  convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async getOrderList(){
    const res= await(await this.service.getProduct({
      selector:'name,description,price,stock,category_id,image_path,discountPrice',
      searchValue:this.searchValue
    })).toPromise();
    if(!res.IsSuccessful) return this.showError(res.Errors)
      this.product = res.Data
  }
  async getCategoryList(){
    const res= await(await this.service.getCategory({
      selector:'name,parent_id',
      searchValue:this.searchValue
    })).toPromise();
    if(!res.IsSuccessful) return this.showError(res.Errors)
      this.categories = res.Data
  }
  ngOnInit(){
    this.getCategoryList()
    this.getOrderList()
  }
}


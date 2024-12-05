import { inject, Inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';





@Injectable()
export abstract class BaseService {

  private http!: HttpClient;
  private route!: Router;
  protected static headers: any = {}




  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

  //   })p
  // };
  customController: string = '';
  isCustomControler: boolean = false;
  propsToInclude: any[] = []




  constructor(@Inject(String) public controller: string,) {
    const token = localStorage.getItem('token');
    this.http = inject(HttpClient)
    this.route = inject(Router)
    BaseService.headers['Content-Type'] = 'application/json';
    BaseService.headers['Authorization'] = 'bearer ' + token;
    BaseService.headers['Access-Control-Allow-Origin'] = '*';



};

  url = '/api';
  // url=environment.proxy


  handleResponse(fullRes: any) {

    const response = fullRes.body

    const resObj: any = {
      Data: null,
      IsSuccessful: false,
      Errors: null,
      statusCode: undefined,
      Headers: fullRes.headers
    }


    if (!fullRes.ok) {

      resObj.statusCode = fullRes.status;
      if (fullRes.status === 401) {
        this.route.navigate(['/auth'])
        resObj.Errors = fullRes.error && fullRes.error.message ? fullRes.error.message : fullRes.error.error

        resObj.IsSuccessful = false;

      } else if (fullRes.status == 504) {
        resObj.Errors = 'Connection Error'

      } else if (fullRes.status === 400) {
        resObj.Errors = fullRes.error && fullRes.error.message ? fullRes.error.message : fullRes.error.error
        // resObj.Errors = fullRes.messsgae
        resObj.IsSuccessful = false;

      }
    } else {
      resObj.IsSuccessful = true
      resObj.Data = response;
    }
    return resObj



  }
  private getHeaders(customHeaders?: { [key: string]: string }): HttpHeaders {
    let branchId;
    let token = localStorage.getItem('token');
    const branchData = localStorage.getItem('selectedBranch');
    if (branchData) {
      branchId = JSON.parse(branchData).id;
    }
    let headersConfig: any = {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`,
       'Access-Control-Expose-Headers': '*',
       'Access-Control-Allow-Headers':'*',
       'Access-Control-Allow-Origin':'*',
      //  'Access-Control-Allow-Credential':'*'

    };
    if (branchId) {
      headersConfig['branchId'] = `${branchId}`

    }
    return new HttpHeaders(headersConfig);
  }

  setHeader(key: string, value: string) {
    const customHeaders = { [key]: value };
    this.getHeaders(customHeaders);
  }


  mergeHeader(header: any, otherHeaders: any) {
    if (otherHeaders) {
      let copyHeader = JSON.parse(JSON.stringify(header));
      const keys = Object.keys(otherHeaders);
      keys.forEach(x => copyHeader[x] = otherHeaders[x]);
      return copyHeader;
    }
    return header;

  }

  GetUrl(MethodName: string, param: any[] = []) {
    let url = `${this.url}${this.isCustomControler ? '/' + this.customController : this.controller}${MethodName ? '/'+MethodName : ''}`;
    if (Array.isArray(param) && param.length > 0) {
      url = url.concat(param.reduce((prev, curr) => {
        return (curr.value != null && curr.value != '') ? prev.concat(curr.name.concat('=').concat(encodeURIComponent(curr.value).concat('&'))) : prev.concat('');
      }, '?'));
      if (url.lastIndexOf('&') === (url.length - 1)) {
        url = url.substring(0, url.lastIndexOf('&'));
      }
    }
    return url;
  }

  Get(MethodName: string, params?: any[]): Observable<any> {
    let obj: any = {};
    let url = `${this.url}${this.isCustomControler ? '/'+ this.customController : this.controller}${MethodName ? '/'+MethodName : ''}`;

    if (params && params.length > 0) {
      return this.http.get(this.GetUrl(MethodName, params), { headers: this.getHeaders(), observe: 'response' }).pipe(map((res: any) => {
        return this.handleResponse(res);
      }), catchError((error: any) => {
        return this.handleResponse(error);
      })
      )
    }
    else {
      return this.http.get(url, { headers: this.getHeaders(), observe: 'response' }).pipe(map((res: any) => {
        return this.handleResponse(res);
      }), catchError((error: any) => {
        const obj = this.handleResponse(error);

        return of(obj);
      })
      )
    }

  }

  Put(MethodName: string, body: any): Observable<any> {
    let obj: any = {};
    let url = `${this.url}${this.isCustomControler ? '/' + this.customController : this.controller}${MethodName ? '/'+MethodName : ''}`;

    return this.http.put(url, body, { headers: this.getHeaders(), observe: 'response' }).pipe(map((res: any) => {
      return this.handleResponse(res);
    }), catchError((error: any) => {
      const obj = this.handleResponse(error);
      return of(obj);

    })
    )
  }

  Post(MethodName: any, body: any): Observable<any> {
    let obj: any = {};
    const header = this.getHeaders()
    let url = `${this.url}${this.isCustomControler ? '/' + this.customController : this.controller}${MethodName ? '/'+MethodName : ''}`;

    // let url = `${this.url}${this.isCustomControler ? this.customController : this.controller}/${MethodName}`
    return this.http.post(url, body, { headers: this.getHeaders(), observe: 'response' }).pipe(map((res: any) => {
      const obj = this.handleResponse(res)
      return obj;
    }), catchError((error: any) => {
      const obj = this.handleResponse(error)
      return of(obj);
    })
    )
  }

  Delete(MethodName: string, params?: any[]): Observable<any> {
    let obj: any = {};
    let url = `${this.url}${this.controller}/${MethodName}`
    return this.http.delete(this.GetUrl(MethodName, params), { headers: this.getHeaders(), observe: 'response' }).pipe(map((res: any) => {
      const obj = this.handleResponse(res)
      return obj;
    }), catchError((error: any) => {
      const obj = this.handleResponse(error)
      return of(obj)
    })
    );

  }


  async save(model: any, key?: any) {
    if (key) {
      return await this.Put(key, model)
    }
    return await this.Post('POST', model)
  }

  async getDataById(primaryKey?: any) {

    return await this.Get(primaryKey)

  }



  downloadFile(fileName:string,url: string): void {
    this.http
      .get(url, {responseType: 'blob', observe: 'response' })
      .subscribe((response:any) => {
        const contentTypeHeader = response.headers.get('content-type');
        const fileExtension = this.getFileExtensionFromContentType(contentTypeHeader);

        const blob = new Blob([response.body], { type: contentTypeHeader });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }

  private getFileExtensionFromContentType(contentType: string | null): string {
    if (!contentType) {
      return 'unknown';
    }

    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf',
      // Add more mappings as needed
    };

    const defaultExtension = 'unknown';

    const matchedExtension = extensions[contentType.toLowerCase()];
    return matchedExtension || defaultExtension;
  }

  setController(controllerName: string) {
    this.controller = controllerName
  }
}

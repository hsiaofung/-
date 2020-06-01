import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import { AuthService } from "./auth.service";

@Injectable()
export class StockAppInterceptor implements HttpInterceptor {
  // 實作攔截器介面
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.authToken) {
      // 檢查伺服器中的認證憑證
      const authReq = req.clone({
        headers: req.headers.set("Authorization", this.authService.authToken),
      });

      // 實作攔截器這個API
      console.log("Making an authorized reqest");
      req = authReq; // 以額外的標頭改變請求為有認證的請求。
    }
    return next.handle(req).do(
      // 呼叫handle 這個API以繼續處理鏈
      (event) => this.handleResponse(req, event),
      (error) => this.handleError(req, error)
    );
  }

  handleResponse(req: HttpRequest<any>, event) {
    // 處理成功回應
    console.log("Handling response for ", req.url, event);
    if (event instanceof HttpResponse) {
      console.log(
        "Request for ",
        req.url,
        " Response Status ",
        event.status,
        " With body ",
        event.body
      );
    }
  }

  handleError(req: HttpRequest<any>, event) {
    // 處理錯誤回應
    console.error(
      "Request for ",
      req.url,
      " Response Status ",
      event.status,
      " With error ",
      event.error
    );
  }
}

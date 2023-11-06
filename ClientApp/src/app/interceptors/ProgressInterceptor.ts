import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  Observable,
  catchError,
  finalize,
  of,
  retry,
  tap,
  throwError,
} from 'rxjs';

import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProgressInterceptor implements HttpInterceptor {
  /**
   *
   */
  constructor(
    private spinnerService: NgxSpinnerService,
    private toaster: ToastrService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerService.show();
    //https://careydevelopment.us/blog/angular-how-to-handle-errors-with-an-http-interceptor
    return next.handle(req).pipe(
      retry(1),
      catchError((returnedError) => {
        if (!this.handleServerSideError(returnedError)) {
          return of(returnedError);
        } else {
          return 'Unexpected error.';
        }
      }),
      finalize(() => {
        this.spinnerService.hide();
      })
    );
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    switch (error.status) {
      case 0:
        this.toaster.error('Cannot connect to server!');
        return true;
      case 401:
        //log in again
        return true;
      case 403:
        //log in again
        return true;
    }

    return false;
  }
}

export const ProgressInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ProgressInterceptor,
  multi: true,
};

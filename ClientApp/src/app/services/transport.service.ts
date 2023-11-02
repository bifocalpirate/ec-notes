import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OutboundPayload } from '../models/outbound-payload';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  constructor(private httpClient: HttpClient) {}

  public uploadData(
    website: string,
    outbound: OutboundPayload
  ): Observable<any> {
    return this.httpClient.post('api/vault/' + website, outbound, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public getWebsite(website: string): Observable<any> {
    return this.httpClient.get(`api/vault/${website}`);
  }
}

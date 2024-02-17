import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  itemsURL = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/data/pt_BR/item.json';
  imageURL = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/';

  constructor(private http: HttpClient) { }

  getItens(): Observable<any> {
    return this.http.get(this.itemsURL);
  }


}

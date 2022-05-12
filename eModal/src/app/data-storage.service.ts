import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private ht: HttpClient) { }

  getDataContainer(tokenHeader: any) { return this.ht.get("https://localhost:7152/api/edidata", tokenHeader) }
  // postDataProduct(data: any, tokenHeader: any) { return this.ht.post("https://localhost:7146/api/Products", data, tokenHeader); }
  // putDataProduct(data: any, id: any, tokenHeader: any) { return this.ht.put(`https://localhost:7146/api/Products/${id}`, data, tokenHeader); }
  // deleteDataProduct(id: any, tokenHeader: any) { return this.ht.delete(`https://localhost:7146/api/Products/${id}`, tokenHeader) }

  getDataUserWatchlist(tokenHeader: any) { return this.ht.get("https://localhost:7152/api/AddedWatchlistData", tokenHeader) }
  postDataUserWatchlist(data: any, tokenHeader: any) { return this.ht.post("https://localhost:7152/api/AddedWatchlistData", data, tokenHeader) }
  deleteDataUserWatchlist(id: any, tokenHeader: any) { return this.ht.delete(`https://localhost:7152/api/AddedWatchlistData/${id}`, tokenHeader) }

  getAuthJWTUsingPostMethod(data: any) { return this.ht.post("https://localhost:7152/api/Users/authenticate", data) }
}

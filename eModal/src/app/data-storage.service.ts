import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private ht: HttpClient) { }

  getDataContainer(tokenHeader: any) { return this.ht.get("http://efcyit-ltr909:8578/api/edidata", tokenHeader) }

  postSignUp(data: any) { return this.ht.post("http://efcyit-ltr909:8578/api/UserData", data) }

  getTransactionData(tokenHeader: any) { return this.ht.get("http://efcyit-ltr909:8578/api/TransactionData", tokenHeader) }
  postTransactionData(data: any, tokenHeader: any) { return this.ht.post("http://efcyit-ltr909:8578/api/TransactionData", data, tokenHeader) }

  getDataUserWatchlist(tokenHeader: any) { return this.ht.get("http://efcyit-ltr909:8578/api/AddedWatchlistData", tokenHeader) }
  postDataUserWatchlist(data: any, tokenHeader: any) { return this.ht.post("http://efcyit-ltr909:8578/api/AddedWatchlistData", data, tokenHeader) }
  deleteDataUserWatchlist(id: any, tokenHeader: any) { return this.ht.delete(`http://efcyit-ltr909:8578/api/AddedWatchlistData/${id}`, tokenHeader) }

  getAuthJWTUsingPostMethod(data: any) { return this.ht.post("http://efcyit-ltr909:8578/api/Users/authenticate", data) }
}

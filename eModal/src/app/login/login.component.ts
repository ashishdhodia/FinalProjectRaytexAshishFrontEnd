import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private getJWT: DataStorageService, private fB: FormBuilder, private router: Router) { }
  invalidLogin!: boolean
  credForm: any

  login(form: FormGroup) {
    // console.log(form.value.username)
    this.getJWT.getAuthJWTUsingPostMethod(form.value).subscribe((data: any) => {
      const token = data.token
      localStorage.setItem("jwt", token)
      // console.log(data);
      this.invalidLogin = false
      this.router.navigate(["/watchlist"])
    }, err => {
      this.invalidLogin = true
    })
  }
  ngOnInit(): void {
    this.credForm = this.fB.group({
      "username": ["", [Validators.required]],
      "password": ["", [Validators.required]]
    })
  }

}

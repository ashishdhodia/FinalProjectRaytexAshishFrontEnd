import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private getData: DataStorageService, private fB: FormBuilder, private router: Router) { }

  signUpForm: any
  validSignUp!: boolean

  signUpPost(data: any) {
    this.getData.postSignUp(data).subscribe((data) => {
      this.validSignUp = true
      setTimeout(() => {
        this.router.navigate(['login']);
    }, 1000);
    })
  }

  ngOnInit(): void {
    this.signUpForm = this.fB.group({
      "emailId": ["", [Validators.required, Validators.email]],
      "userId": ["", [Validators.required, Validators.minLength(6)]],
      "userPass": ["", [Validators.required]],
      "userAddress": ["", [Validators.required]]
    })
  }

}

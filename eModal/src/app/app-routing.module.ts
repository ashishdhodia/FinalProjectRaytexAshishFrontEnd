import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './auth.guard'
import { ContainerBookingComponent } from './container-booking/container-booking.component'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { TransactionSuccessComponent } from './transaction-success/transaction-success.component'
import { UserProfileComponent } from './user-profile/user-profile.component'
import { WatchlistComponent } from './watchlist/watchlist.component'

const routes: Routes = [
  { path: "watchlist", component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: "sign-up", component: SignUpComponent },
  { path: "transaction-success", component: TransactionSuccessComponent, canActivate: [AuthGuard] },
  { path: "container-booking", component: ContainerBookingComponent }
  // { path: '', component: LoginComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

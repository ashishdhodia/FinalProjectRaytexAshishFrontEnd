import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './auth.guard'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { UserProfileComponent } from './user-profile/user-profile.component'
import { WatchlistComponent } from './watchlist/watchlist.component'

const routes: Routes = [
  { path: "watchlist", component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "user-profile", component: UserProfileComponent, canActivate: [AuthGuard] }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

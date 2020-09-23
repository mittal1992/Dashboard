import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListingComponent } from './listing/listing.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'listing', component: DashboardComponent},
  {path:'listing/:listingId', component:ListingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

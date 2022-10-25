import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './views/board/board.component';
import { GameControllerComponent } from './views/game-controller/game-controller.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'board'},
  {path: 'board', component: BoardComponent},
  {path: 'controller', component: GameControllerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

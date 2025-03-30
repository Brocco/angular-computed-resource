import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: ` <header>
      <nav>
        <ul>
          <li>
            <a routerLinkActive="active" [routerLink]="['separate-resources']"
              >Separate Resources</a
            >
          </li>
          <li>
            <a routerLinkActive="active" [routerLink]="['computed-resource']">Computed Resources</a>
          </li>
        </ul>
      </nav>
    </header>

    <h1>Customer Order Data</h1>
    <router-outlet></router-outlet>`,
  styles: `
    ul {
      display: flex;
    }
    li {
      display: inline-block;
      margin: 5px;
    }
    a {
      border: 1px solid blue;
      padding: 10px;
      color: blue;
      text-decoration: none;
    }
    a.active {
      background-color: lightblue;
    }
  `,
})
export class AppComponent {
  private activatedRoute = inject(ActivatedRoute);
  ar = this.activatedRoute.pathFromRoot;
}

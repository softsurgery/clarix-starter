import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, HlmBreadCrumbImports],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  layoutService = inject(LayoutService);
}

import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutService } from "../layout.service";
import { HlmBreadcrumbImports } from "@spartan-ng/helm/breadcrumb";

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [CommonModule, HlmBreadcrumbImports],
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.css"],
})
export class BreadcrumbComponent {
  layoutService = inject(LayoutService);
}

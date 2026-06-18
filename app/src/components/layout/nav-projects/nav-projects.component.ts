import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  lucideChartPie,
  lucideEllipsis,
  lucideFolder,
  lucideFrame,
  lucideMap,
  lucideShare,
  lucideTrash2,
} from "@ng-icons/lucide";
import { HlmDropdownMenuImports } from "@spartan-ng/helm/dropdown-menu";
import { HlmSidebarImports, HlmSidebarService } from "@spartan-ng/helm/sidebar";

@Component({
  selector: "app-nav-projects",
  imports: [HlmSidebarImports, NgIcon, RouterLink, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideFrame,
      lucideChartPie,
      lucideMap,
      lucideEllipsis,
      lucideFolder,
      lucideShare,
      lucideTrash2,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./nav-projects.component.html",
  styleUrls: ["./nav-projects.component.css"],
})
export class NavProjectsComponent {
  private readonly _sidebarService = inject(HlmSidebarService);
  protected readonly _menuSide = computed(() =>
    this._sidebarService.isMobile() ? "bottom" : "right",
  );
  protected readonly _menuAlign = computed(() =>
    this._sidebarService.isMobile() ? "end" : "start",
  );

  public readonly projects = input.required<
    {
      name: string;
      url: string;
      icon: string;
    }[]
  >();
}

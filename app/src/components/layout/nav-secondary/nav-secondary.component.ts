import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideLifeBuoy, lucideSend } from "@ng-icons/lucide";
import { HlmSidebarImports } from "@spartan-ng/helm/sidebar";

@Component({
  selector: "app-nav-secondary",
  imports: [HlmSidebarImports, NgIcon, RouterLink],
  providers: [provideIcons({ lucideLifeBuoy, lucideSend })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./nav-secondary.component.html",
  styleUrls: ["./nav-secondary.component.css"],
})
export class NavSecondaryComponent {
  public readonly items = input.required<
    {
      title: string;
      url: string;
      icon: string;
    }[]
  >();
}

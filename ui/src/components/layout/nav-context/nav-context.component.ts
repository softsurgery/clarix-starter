import { Component, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  HlmSidebarMenu,
  HlmSidebarMenuItem,
  HlmSidebarMenuButton,
} from "@spartan-ng/helm/sidebar";
import {
  HlmDropdownMenu,
  HlmDropdownMenuTrigger,
  HlmDropdownMenuLabel,
  HlmDropdownMenuItem,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuShortcut,
} from "@spartan-ng/helm/dropdown-menu";
import { HlmIconImports } from "@spartan-ng/helm/icon";

export interface Team {
  name: string;
  logo: string;
  plan: string;
}

@Component({
  selector: "app-nav-context",
  standalone: true,
  imports: [
    CommonModule,
    HlmSidebarMenu,
    HlmSidebarMenuItem,
    HlmSidebarMenuButton,
    HlmDropdownMenu,
    HlmDropdownMenuTrigger,
    HlmDropdownMenuLabel,
    HlmDropdownMenuItem,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuShortcut,
    ...HlmIconImports,
  ],
  providers: [],
  templateUrl: "./nav-context.component.html",
  styleUrls: ["./nav-context.component.css"],
})
export class NavContextComponent implements OnInit {
  @Input() teams: Team[] = [
    { name: "Team Alpha", logo: "/assets/team-alpha-logo.png", plan: "Pro" },
    {
      name: "Team Beta",
      logo: "/assets/team-beta-logo.png",
      plan: "Free",
    },
  ];
  activeTeam = signal<Team | null>(null);

  ngOnInit() {
    if (this.teams.length > 0) {
      this.activeTeam.set(this.teams[0]);
    }
  }

  setActiveTeam(team: Team): void {
    this.activeTeam.set(team);
  }

  getKeyboardShortcut(index: number): string {
    return `⌘${index + 1}`;
  }
}

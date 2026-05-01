import { Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';
import { LucideAngularModule, Moon, Sun, Monitor } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'app-mode-toggle',
  imports: [CommonModule, LucideAngularModule, HlmButton, ...HlmDropdownMenuImports],
  templateUrl: './mode-toggle.component.html',
  styleUrl: './mode-toggle.component.css',
})
export class ModeToggleComponent {
  readonly layoutService = inject(LayoutService);

  //icons
  Moon = Moon;
  Sun = Sun;
  Monitor = Monitor;
}

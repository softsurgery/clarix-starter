import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsComponent } from '../charts.component';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-charts-input',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmInputImports, HlmButtonImports],
  templateUrl: 'charts-input.component.html',
  styleUrls: ['charts-input.component.css'],
})
export class ChartsInputComponent {
  @Input() charts!: ChartsComponent;

  onGenerate() {
    if (!this.charts.loading() && this.charts.question.trim() && this.charts.selectedDataSourceId) {
      this.charts.generateCharts();
    }
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QAComponent } from '../qa.component';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-agent-input',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmInputImports],
  templateUrl: 'qa-input.component.html',
})
export class QAnputComponent {
  @Input() agent!: QAComponent;

  onAsk() {
    if (!this.agent.loading() && this.agent.question.trim() && this.agent.selectedDataSourceId) {
      this.agent.askQuestion();
    }
  }
}

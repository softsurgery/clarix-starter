import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { ModelTestComponent } from '@/pages/model-test/model-test.component';

@Component({
  selector: 'app-model-test-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ...HlmButtonImports, ...HlmTextareaImports],
  templateUrl: './model-test-input.component.html',
})
export class ModelTestInputComponent {
  @Input() modelTest!: ModelTestComponent;

  onRunTest() {
    if (!this.modelTest.loading() && this.modelTest.prompt.trim()) {
      void this.modelTest.runTest();
    }
  }
}

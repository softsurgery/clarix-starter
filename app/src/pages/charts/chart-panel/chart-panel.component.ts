import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-chart-panel',
  standalone: true,
  templateUrl: 'chart-panel.component.html',
  styleUrls: ['chart-panel.component.css'],
})
export class ChartPanelComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) option!: EChartsOption;
  @Input() error?: string;
  @Input() fullscreen = false;

  @ViewChild('chartHost', { static: true }) chartHost!: ElementRef<HTMLDivElement>;

  private instance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    this.instance = echarts.init(this.chartHost.nativeElement);
    this.instance.setOption(this.option, true);
    this.resizeObserver = new ResizeObserver(() => this.instance?.resize());
    this.resizeObserver.observe(this.chartHost.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['option'] && this.instance) {
      this.instance.setOption(this.option, true);
    }

    if (changes['fullscreen'] && this.instance) {
      requestAnimationFrame(() => this.instance?.resize());
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.instance?.dispose();
    this.instance = null;
  }
}

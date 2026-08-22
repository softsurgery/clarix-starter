import type { EChartsOption } from 'echarts';
import { ChartPlanSpec, ChartType } from '../interfaces/ask-chart.dto';

const CHART_COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452'];

export class ChartBuilderService {
  buildOption(spec: ChartPlanSpec, data: Record<string, unknown>[]): EChartsOption {
    if (!data.length) {
      return this.emptyOption(spec.title, 'No data returned from query');
    }

    switch (spec.type) {
      case 'pie':
        return this.buildPieOption(spec, data);
      case 'scatter':
        return this.buildScatterOption(spec, data);
      case 'line':
      case 'bar':
      case 'area':
        return this.buildCartesianOption(spec, data);
      default:
        return this.emptyOption(spec.title, `Unsupported chart type: ${spec.type satisfies never}`);
    }
  }

  private buildCartesianOption(
    spec: ChartPlanSpec,
    data: Record<string, unknown>[],
  ): EChartsOption {
    const xField = spec.xField ?? Object.keys(data[0])[0];
    const yFields = spec.yFields?.length ? spec.yFields : [Object.keys(data[0])[1]];
    const categories = data.map((row) => String(row[xField] ?? ''));

    const series = yFields.map((field, index) => ({
      name: spec.seriesNames?.[index] ?? field,
      type: (spec.type === 'area' ? 'line' : spec.type) as 'line' | 'bar',
      data: data.map((row) => toNumber(row[field])),
      ...(spec.type === 'area' ? { areaStyle: {} } : {}),
      ...(spec.type === 'line' || spec.type === 'area' ? { smooth: true } : {}),
    }));

    return {
      color: CHART_COLORS,
      title: { text: spec.title, left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      legend: yFields.length > 1 ? { bottom: 0 } : undefined,
      grid: { left: 48, right: 24, top: 48, bottom: yFields.length > 1 ? 48 : 32 },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: categories.length > 8 ? 35 : 0, interval: 0 },
      },
      yAxis: { type: 'value' },
      series,
    };
  }

  private buildPieOption(spec: ChartPlanSpec, data: Record<string, unknown>[]): EChartsOption {
    const nameField = spec.nameField ?? spec.xField ?? Object.keys(data[0])[0];
    const valueField = spec.valueField ?? spec.yFields?.[0] ?? Object.keys(data[0])[1];

    return {
      color: CHART_COLORS,
      title: { text: spec.title, left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', top: 'middle' },
      series: [
        {
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['58%', '55%'],
          data: data.map((row) => ({
            name: String(row[nameField] ?? ''),
            value: toNumber(row[valueField]),
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
      ],
    };
  }

  private buildScatterOption(spec: ChartPlanSpec, data: Record<string, unknown>[]): EChartsOption {
    const xField = spec.xField ?? Object.keys(data[0])[0];
    const yField = spec.yFields?.[0] ?? Object.keys(data[0])[1];

    return {
      color: CHART_COLORS,
      title: { text: spec.title, left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      grid: { left: 48, right: 24, top: 48, bottom: 32 },
      xAxis: { type: 'value', name: xField },
      yAxis: { type: 'value', name: yField },
      series: [
        {
          type: 'scatter',
          name: spec.seriesNames?.[0] ?? yField,
          data: data.map((row) => [toNumber(row[xField]), toNumber(row[yField])]),
        },
      ],
    };
  }

  private emptyOption(title: string, message: string): EChartsOption {
    return {
      title: {
        text: title,
        subtext: message,
        left: 'center',
        top: 'center',
        textStyle: { fontSize: 14 },
        subtextStyle: { fontSize: 12 },
      },
    };
  }
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isSupportedChartType(type: string): type is ChartType {
  return ['line', 'bar', 'pie', 'scatter', 'area'].includes(type);
}

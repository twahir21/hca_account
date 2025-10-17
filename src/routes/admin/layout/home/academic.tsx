import { component$, useSignal,  useTask$, useVisibleTask$ } from '@builder.io/qwik';

type SeriesPoint = number | null;

interface AcademicTrendChartProps {
  title?: string;
  labels: string[];              // e.g., ["Jan", "Feb", ...] or ["Term 1", ...]
  seriesName?: string;           // e.g., "Average Score"
  data: SeriesPoint[];           // e.g., [72, 75, 78, ...]
}

export const AcademicTrendChart = component$((props: AcademicTrendChartProps) => {
  const containerRef = useSignal<HTMLElement>();
  const chartRef = useSignal<any>(null);

  // Build chart when visible on the client
  useVisibleTask$(async () => {
    const ApexCharts = (await import('apexcharts')).default;
const options: ApexCharts.ApexOptions = {
  chart: {
    type: 'area', // change to area
    height: 320,
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: '#4b5563',
  },
  series: [
    {
      name: props.seriesName ?? 'Average Score',
      data: props.data,
    },
  ],
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  markers: {
    size: 4,
    hover: { size: 6 },
  },
  colors: ['#4a90e2'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      shadeIntensity: 0.3,
      type: 'vertical', // top to bottom
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: '#4a90e2',
          opacity: 0.4,
        },
        {
          offset: 100,
          color: '#ffffff',
          opacity: 0,
        },
      ],
    },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  xaxis: {
    categories: props.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#6b7280' } },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      formatter: (v) => `${Math.round(v)}%`,
      style: { colors: '#6b7280' },
    },
  },
  tooltip: {
    y: { formatter: (v) => `${v}%` },
  },
  legend: { show: false },
  title: {
    text: props.title ?? 'Academic Performance Trend',
    style: { color: '#253c6a', fontWeight: 700 },
  },
};

    chartRef.value = new ApexCharts(containerRef.value, options);
    await chartRef.value.render();

    return () => {
      chartRef.value?.destroy();
      chartRef.value = null;
    };
  });

  // If props change (labels/data), update the chart on the client
  useTask$(({ track }) => {
    track(() => [props.labels, props.data, props.seriesName, props.title]);
    if (chartRef.value) {
      chartRef.value.updateOptions({
        xaxis: { categories: props.labels },
        title: { text: props.title ?? 'Academic Performance Trend' },
        series: [{ name: props.seriesName ?? 'Average Score', data: props.data }],
      });
    }
  });

  return (
    <div class="w-full">
      <div class="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-[#253c6a]">
              {props.title ?? 'Academic Performance Trend'}
            </h3>
            <p class="text-sm text-gray-500">Average scores over time</p>
          </div>
          {/* optional actions / filters can go here */}
        </div>
        <div ref={containerRef} class="w-full"></div>
      </div>
    </div>
  );
});

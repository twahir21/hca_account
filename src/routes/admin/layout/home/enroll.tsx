import { component$, useSignal, useVisibleTask$, useTask$ } from '@builder.io/qwik';

interface EnrollmentDonutChartProps {
  boys: number;
  girls: number;
  centerImage?: string; // optional center logo/image
}

export const EnrollmentDonutChart = component$((props: EnrollmentDonutChartProps) => {
  const containerRef = useSignal<HTMLElement>();
  const chartRef = useSignal<any>(null);
  const total = useSignal(0);

  useVisibleTask$(async () => {
    const ApexCharts = (await import('apexcharts')).default;

    total.value = props.boys + props.girls;

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'donut',
        height: 300,
        toolbar: { show: false },
      },
      series: [props.boys, props.girls],
      labels: ['Boys', 'Girls'],
      colors: ['#faf195', '#b785e6'], // blue-500, pink-500
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return `${val.toFixed(1)}%`; // shows percentage inside
        },
        style: {
          fontSize: '14px',
          fontWeight: 600,
          colors: ['#333'], // white text inside donut slices
        },
        dropShadow: { enabled: false },
      },
      legend: {
        position: 'bottom',
        labels: { colors: '#4b5563' },
      },
      tooltip: {
        y: { formatter: (val) => `${val} Students` },
      },
    };

    chartRef.value = new ApexCharts(containerRef.value, options);
    await chartRef.value.render();

    return () => {
      chartRef.value?.destroy();
      chartRef.value = null;
    };
  });

  useTask$(({ track }) => {
    track(() => [props.boys, props.girls]);
    if (chartRef.value) {
      chartRef.value.updateSeries([props.boys, props.girls]);
    }
  });

  return (
    <div class="relative w-full max-w-sm mx-auto">
      <div ref={containerRef}></div>

      <p class="pt-4 text-sm text-center">Total Students: <span class="font-bold text-purple-900">{total.value}</span></p>
    </div>
  );
});

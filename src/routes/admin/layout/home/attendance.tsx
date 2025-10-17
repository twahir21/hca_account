// File: src/components/attendance-chart.tsx
import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import ApexCharts from "apexcharts";

export const AttendanceGraph = component$(() => {
  const chartRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    if (!chartRef.value) return;

    // Sample data for the chart
    const options = {
      series: [
        {
          name: "Presents",
          data: [120, 115, 130, 140, 125],
          color: "#4CAF50",
        },
        {
          name: "Absents",
          data: [10, 15, 8, 5, 12],
          color: "#F44336",
        },
      ],
      chart: {
        type: "bar",
        height: 380,
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 6,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "14px",
            fontWeight: 500,
          },
        },
      },
      yaxis: {
        title: {
          text: "Number of Students",
          style: {
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 400,
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "14px",
          },
        },
      },
      fill: {
        opacity: 1,
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },
      grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "16px",
        itemMargin: {
          horizontal: 16,
          vertical: 8,
        },
        markers: {
          width: 16,
          height: 16,
          radius: 8,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " students";
          },
        },
        style: {
          fontSize: "14px",
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "60%",
              },
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.value, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  });

  return (
    <div class="p-0">
      <div class="max-w-6xl mx-auto">

        <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-3 md:p-8 overflow-hidden border border-purple-500">
            <h1 class="font-bold text-xl">Total Attendances:</h1>
            {/* Analytics  */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="bg-green-50 p-4 rounded-xl">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-700">Total Present</h3>
                  <p class="text-2xl font-bold text-gray-900">845</p>
                </div>
              </div>
            </div>

            <div class="bg-red-50 p-4 rounded-xl">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-red-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-700">Total Absent</h3>
                  <p class="text-2xl font-bold text-gray-900">88</p>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 p-4 rounded-xl">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-gray-700">Attendance Rate</h3>
                  <p class="text-2xl font-bold text-gray-900">90.6%</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={chartRef} id="attendance-chart"></div>

        </div>
      </div>
    </div>
  );
});
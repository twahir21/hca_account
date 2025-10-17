import { component$ } from '@builder.io/qwik';
import { AcademicTrendChart } from './academic';

export const AcademicChart = component$(() => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const data =  [72, 75, 78, 80, 30, 82, 85, 88];

  return (
    <section class="w-full border border-yellow-600 bg-white rounded-2xl">
      <AcademicTrendChart
        title="Academic Performance (Avg %)"
        labels={labels}
        data={data}
        seriesName="Average Score"
      />
    </section>
  );
});

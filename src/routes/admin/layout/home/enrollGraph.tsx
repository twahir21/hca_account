import { component$ } from '@builder.io/qwik';
import { EnrollmentDonutChart } from './enroll';

export const EnrollGraph = component$(() => {
  return (
    <section class="max-w-4xl mx-auto p-6 border border-yellow-600 bg-white w-full rounded-2xl">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        Enrollment Distribution
      </h2>
      <EnrollmentDonutChart
        boys={400}
        girls={580}
      />
    </section>
  );
});

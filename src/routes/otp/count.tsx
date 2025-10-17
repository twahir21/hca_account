import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

// Initial time in seconds (5 minutes * 60 seconds)
const INITIAL_SECONDS = 5 * 60;

export const CountdownTimer = component$(() => {
  // Signal to hold the remaining time in seconds
  const remainingSeconds = useSignal(INITIAL_SECONDS);
  // Signal to hold the interval ID for cleanup
  const intervalId = useSignal<NodeJS.Timeout | undefined>(undefined);

  // --- Logic to run ONLY on the client and ONLY when visible ---
  useVisibleTask$(({ cleanup }) => {
    // 1. Start the interval timer
    const id = setInterval(() => {
      // 2. Decrement the time every second
      remainingSeconds.value = Math.max(0, remainingSeconds.value - 1);
      
      // 3. Stop the timer if it hits zero
      if (remainingSeconds.value <= 0) {
        clearInterval(id);
      }
    }, 1000);

    // Store the ID so it can be cleaned up later
    intervalId.value = id;

    // 4. Register the cleanup function
    // This runs when the component is unmounted or when the dependencies change.
    // Since there are no dependencies, it runs on unmount.
    cleanup(() => {
      if (intervalId.value) {
        clearInterval(intervalId.value);
      }
    });
  });

  // --- Helper to format the time ---
  const minutes = Math.floor(remainingSeconds.value / 60).toString().padStart(2, '0');
  const seconds = remainingSeconds.value % 60;
  
  // Format seconds to always show two digits (e.g., 05, 10, 59)
  const secondsDisplay = String(seconds).padStart(2, '0');
  
  // --- Render Logic ---
  return (
    <div style={{ 
      fontWeight: 'bold', 
      textAlign: 'center',
      paddingBottom: '10px',
      color: remainingSeconds.value <= 10 ? 'red' : '#4a90e2' 
    }}>
      {remainingSeconds.value > 0 ? (
        // Display the countdown
        <span>
          {minutes}:{secondsDisplay}
        </span>
      ) : (
        // Display "EXPIRED" message
        <span style={{ color: 'red' }}>
          EXPIRED!
        </span>
      )}
    </div>
  );
});
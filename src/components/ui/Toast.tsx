import { component$, QRL, useSignal, useVisibleTask$ } from '@builder.io/qwik';

type ToastProps = {
  message: string;
  isOpen: boolean;
  duration: number;
  type: 'success' | 'error';
  onClose$: QRL<() => void>;
};

export const Toast = component$<ToastProps>(
  ({ isOpen, type, message, duration, onClose$ }) => {
    const isPaused = useSignal(false);
    const startTime = useSignal(0);
    const rerun = useSignal(false);
    const elapsedTime = useSignal(0);
    const timerId = useSignal<number>();

    // Handle timer lifecycle
    useVisibleTask$(({ track, cleanup }) => {
      track(() => isOpen);
      track(() => rerun.value);
      track(() => isPaused.value);

      if (isOpen && !isPaused.value) {
        const remaining = duration - elapsedTime.value;
        startTime.value = Date.now();

        timerId.value = window.setTimeout(() => {
          onClose$?.();
        }, remaining);
      }

      if (!isOpen || isPaused.value) {
        if (timerId.value) {
          clearTimeout(timerId.value);
          timerId.value = undefined;
        }
        if (isPaused.value) {
          elapsedTime.value += Date.now() - startTime.value;
        } else {
          elapsedTime.value = 0;
        }
      }

      cleanup(() => {
        if (timerId.value) clearTimeout(timerId.value);
      });
    });

    if (!isOpen) return null;

    // Progress bar duration (seconds)
    const remainingSec = (duration - elapsedTime.value) / 1000;

    return (
      <>
        <div
          class={`fixed bottom-4 right-4 w-80 border rounded-lg shadow-lg overflow-hidden animate-slide-in z-50 ${
            type === 'success'
              ? 'bg-green-50 border-green-600'
              : 'bg-red-50 border-red-600'
          }`}
          onMouseEnter$={() => (isPaused.value = true)}
          onMouseLeave$={() => (isPaused.value = false)}
          onTouchStart$={() => (isPaused.value = true)}
          onTouchEnd$={() => (isPaused.value = false)}
        >
          {/* Header */}
          <div class="flex items-center justify-between px-4 py-2">
            <div class="flex items-center gap-2">
              <i
                class={`fa-solid ${
                  type === 'success'
                    ? 'fa-thumbs-up text-green-600'
                    : 'fa-thumbs-down text-red-600'
                } w-5 h-5`}
              />
              <h1
                class={`text-sm font-semibold ${
                  type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {type === 'success' ? 'Success' : 'Error!'}
              </h1>
            </div>

            <button
              onClick$={() => {
                onClose$?.();
                rerun.value = true;
              }}
              class={`cursor-pointer ${
                type === 'success'
                  ? 'text-green-600 hover:text-green-800'
                  : 'text-red-600 hover:text-red-800'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Message */}
          <div
            class={`px-4 pb-3 text-sm ${
              type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {message}
          </div>

          {/* Progress Bar */}
          <div
            class={`h-1 ${
              type === 'success' ? 'bg-green-200' : 'bg-red-200'
            }`}
          >
            <div
              class={`h-1 ${
                type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{
                width: '100%',
                animation: `progress ${remainingSec}s linear forwards`,
                'animation-play-state': isPaused.value ? 'paused' : 'running',
              }}
            />
          </div>
        </div>

        <style>
          {`
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(70px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .animate-slide-in {
              animation: slideIn 0.3s ease-out;
            }
            @keyframes progress {
              from { transform: scaleX(0); }
              to { transform: scaleX(1); }
            }
            [style*="progress"] {
              transform-origin: left;
            }
          `}
        </style>
      </>
    );
  }
);

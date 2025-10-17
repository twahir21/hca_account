{/* <input
  id="otp"
  type="text"
  inputmode="numeric"
  autocomplete="one-time-code"
  placeholder="Enter code"
/> */}

import { component$, PropFunction, useSignal, useVisibleTask$, $, useTask$ } from '@builder.io/qwik';
import { CountdownTimer } from './count';
import { HomeNav } from '~/components/includes/homeNav';
import { Footer } from '~/components/includes/footer';
import { Form } from '@builder.io/qwik-city';
import { useOTP } from '../plugin';
import { Toast } from '~/components/ui/Toast';

export interface OTPInputProps {
  length?: number;
  onComplete?: PropFunction<(value: string) => void>;
  autoFocus?: boolean;
}

export default component$((props: OTPInputProps) => {
  const length = props.length ?? 6;
  const values = useSignal<string[]>(Array.from({ length }).map(() => ''));
  const inputs = useSignal<(HTMLInputElement | null)[]>(Array.from({ length }).map(() => null));

  // focus first input on mount when requested
  useVisibleTask$(() => {
    if (props.autoFocus) {
      setTimeout(() => inputs.value[0]?.focus(), 20);
    }
  });

  const setValueAt = $((index: number, v: string) => {
    values.value = values.value.slice();
    values.value[index] = v;
  });

  const emitIfComplete = $(() => {
    const joined = values.value.join('');
    if (joined.length === length && /^\d+$/.test(joined)) {
      props.onComplete?.(joined);
    }
  });

  const handleInput$ = $((ev: Event, idx: number) => {
    const input = ev.target as HTMLInputElement;
    const raw = input.value.replace(/[^0-9]/g, '');
    if (!raw) return;

    // If user pasted a full OTP or typed multiple digits, spread them
    const chars = raw.split('');
    for (let i = 0; i < chars.length && idx + i < length; i++) {
      setValueAt(idx + i, chars[i]);
      const next = inputs.value[idx + i + 1];
      if (next) next.value = '';
    }

    // update DOM inputs and focus
    for (let i = 0; i < length; i++) {
      const el = inputs.value[i];
      if (el) el.value = values.value[i] ?? '';
    }

    const nextIdx = Math.min(length - 1, idx + chars.length);
    const nextEl = inputs.value[nextIdx];
    if (nextEl) {
      nextEl.focus();
      // place caret at end
      nextEl.setSelectionRange(nextEl.value.length, nextEl.value.length);
    }

    emitIfComplete();
  });

  const handleKeyDown$ = $((ev: KeyboardEvent, idx: number) => {
    const key = ev.key;
    const target = ev.target as HTMLInputElement;

    if (key === 'Backspace') {
      if (target.value === '') {
        // move to previous
        const prev = inputs.value[idx - 1];
        if (prev) {
          prev.focus();
          prev.value = '';
          setValueAt(idx - 1, '');
          emitIfComplete();
          ev.preventDefault();
        }
      } else {
        // clear this one
        target.value = '';
        setValueAt(idx, '');
        emitIfComplete();
        ev.preventDefault();
      }
    } else if (key === 'ArrowLeft') {
      const prev = inputs.value[Math.max(0, idx - 1)];
      if (prev) prev.focus();
      ev.preventDefault();
    } else if (key === 'ArrowRight') {
      const next = inputs.value[Math.min(length - 1, idx + 1)];
      if (next) next.focus();
      ev.preventDefault();
    }
  });

  const handlePaste$ = $((ev: ClipboardEvent) => {
    ev.preventDefault();
    const text = ev.clipboardData?.getData('text') ?? '';
    const digits = (text.match(/\d+/g) || []).join('');
    if (!digits) return;

    const chars = digits.split('');
    for (let i = 0; i < length; i++) {
      setValueAt(i, chars[i] ?? '');
    }
    // update inputs
    for (let i = 0; i < length; i++) {
      const el = inputs.value[i];
      if (el) el.value = values.value[i] ?? '';
    }

    // focus first empty or last
    const firstEmpty = values.value.findIndex((v) => v === '');
    const focusIdx = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputs.value[focusIdx]?.focus();
    emitIfComplete();
  });

  // Optional helper: try to read clipboard on container click (works only with user gesture in many browsers)
  const tryReadClipboard$ = $(() => {
    if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
      // best-effort; may be denied by browser
      navigator.clipboard.readText?.().then((txt) => {
        const digits = (txt.match(/\d+/g) || []).join('');
        if (digits.length >= length) {
          for (let i = 0; i < length; i++) setValueAt(i, digits[i] ?? '');
          // update inputs
          for (let i = 0; i < length; i++) {
            const el = inputs.value[i];
            if (el) el.value = values.value[i] ?? '';
          }
          emitIfComplete();
        }
      }).catch(() => {
        // ignore permission errors
      });
    }
  });

  // server forms
  const sendOTP = useOTP();

  // 1. toast consts
  const isToastOpen = useSignal(false);
  const toastType = useSignal<'success' | 'error'>('success');
  const toastMessage = useSignal('');

  const showToast = $(({ toastTypeParam, toastMsg } : { toastTypeParam: "success" | "error"; toastMsg: string;}) => {
    toastType.value = toastTypeParam;
    toastMessage.value = toastMsg;
    isToastOpen.value = true;
  });

  useTask$(({ track }) => {
      const form = track(() => sendOTP.value); // track sendOTP
      if (form) {
          showToast({ toastTypeParam: sendOTP.value?.success ? 'success' : 'error', toastMsg: sendOTP.value?.message ?? "Something went wrong!"}); // show toast automatically on change
      }
  });

  return (
    <>
      <HomeNav />
      <div class="min-h-screen flex items-center justify-center p-4 flex-wrap">
          <div
          class="border-4 border-double border-[#4a90e2] rounded-2xl bg-white shadow-lg 
                  p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto mt-6"
          >
              {/* 1. Title */}
              <div>
                  <h1 class="text-2xl font-semibold text-gray-800 text-center mb-2">OTP Verification</h1>
                  <p class="text-gray-500 text-center mb-6">Enter the OTP sent to your phone number</p>

              </div>
              
              <CountdownTimer />
              {/* 2. Inputs  */}
              <Form action={sendOTP}>
                <div
                onPaste$={handlePaste$}
                onClick$={() => tryReadClipboard$()}
                style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
                >
                    {Array.from({ length }).map((_, i) => (
                        <input
                        autofocus={i === 0}
                        key={i}
                        ref={(el) => (inputs.value[i] = el)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        name={`otp[${i}]`}
                        value={values.value[i] ?? ''}
                        onInput$={(ev) => handleInput$(ev, i)}
                        onKeyDown$={(ev) => handleKeyDown$(ev, i)}
                        aria-label={`Digit ${i + 1}`}
                        style={{
                            width: '3rem',
                            height: '3rem',
                            fontSize: '1.25rem',
                            textAlign: 'center',
                            borderRadius: '8px',
                            border: '1px solid #4a90e2',
                        }}
                        />
                    ))}
                </div>

                <div class="mt-4">
                    <p class="text-gray-500 text-center">
                        Don't have an OTP? <a href="/otp" class="text-[#4a90e2]">Resend</a>
                    </p>
                </div>

                <div class="flex items-center justify-center">
                    <button
                    type="submit"
                    class="border border-[#4a90e2] mt-6 py-2 px-4 rounded-md cursor-pointer transition duration-300 ease-in-out text-gray-900"
                    >
                        Submit
                    </button>
                </div>
              </Form>
          </div>
      </div>
      <Footer />

      {/* Toast  */}
      { isToastOpen.value  &&  (
          
          <Toast
            message={toastMessage.value}
            isOpen={isToastOpen.value}
            duration={3000}
            type={toastType.value}
            onClose$={() => (isToastOpen.value = false)}
          />
      )}
    </>
  );
});


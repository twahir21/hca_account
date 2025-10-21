// File: src/components/login-form.tsx
import { component$, useSignal, $, useTask$ } from '@builder.io/qwik';
import { Form, useNavigate, type DocumentHead } from '@builder.io/qwik-city';
// import { useLogin } from '../plugin';
import { HomeNav } from '~/components/includes/homeNav';
import { Footer } from '~/components/includes/footer';
import LoginPhoto from "~/images/login.jpg?jsx";
import { useLogin } from '../plugin';
import { Toast } from '~/components/ui/Toast';


export default component$(() => {
  // 1. Toggle visibility for password
  const passwordVisible = useSignal(false);
  
  const togglePasswordVisibility = $(() => {
    passwordVisible.value = !passwordVisible.value;
  });

  // 2. Server Form
  const loginForm = useLogin();

  // 3. Toast consts
  const isToastOpen = useSignal(false);
  const toastType = useSignal<'success' | 'error'>('success');
  const toastMessage = useSignal('');

  const showToast = $(({ toastTypeParam, toastMsg } : { toastTypeParam: "success" | "error"; toastMsg: string;}) => {
    toastType.value = toastTypeParam;
    toastMessage.value = toastMsg;
    isToastOpen.value = true;
  });

  const nav = useNavigate();

  // 4. Tracking the value
  useTask$(({ track }) => {
    track (() => loginForm.value);
    if (loginForm.value) {
      if (loginForm.value.success) {
        nav("/otp");
      }
      showToast({ toastTypeParam: loginForm.value?.success ? 'success' : 'error', toastMsg: loginForm.value?.message ?? "Something went wrong!"});
    }
  });

return (
  <>
  <HomeNav />
  
  <div class="min-h-screen flex items-center justify-center p-4 flex-wrap">
    <div class="flex flex-col md:flex-row">
    {/* Left (Login Form) */}
    <div class="w-full max-w-md border-4 border-double border-[#4a90e2] rounded-2xl rounded-tr-0 rounded-br-0 bg-white shadow-lg">
      <div class="p-8 rounded-xl">
        <h2 class="text-3xl font-bold text-[#253c6a] mb-6 text-center">Sign In</h2>
        
        <Form action = {loginForm} class="space-y-6">
          {/* Username Field */}
          <div>
            <label for="username" class="block text-sm font-medium text-[#253c6a] mb-2">
              <i class="fas fa-user text-[#4a90e2] mr-2"></i>Username
            </label>
            <div class="relative">
              <input 
                type="text" 
                autofocus={true}
                id="username" 
                name="username"
                class="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-[#4a90e2] transition" 
                placeholder="Enter your username"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-user-circle text-gray-400"></i>
              </div>
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label for="password" class="block text-sm font-medium text-[#253c6a] mb-2">
              <i class="fas fa-lock text-[#4a90e2] mr-2"></i>Password
            </label>
            <div class="relative">
              <input 
                type={passwordVisible.value ? "text" : "password"}
                id="password" 
                name="password"
                class="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-[#4a90e2] transition" 
                placeholder="Enter your password"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-key text-gray-400"></i>
              </div>
              <button 
                type="button" 
                onClick$={togglePasswordVisibility} 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i class={passwordVisible.value 
                  ? "fas fa-eye text-gray-400 hover:text-[#4a90e2]" 
                  : "fas fa-eye-slash text-gray-400 hover:text-[#4a90e2]"}></i>
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            disabled={loginForm.isRunning}
            type="submit" 
            class={`w-full text-xl 
              bg-gradient-to-r from-[#50c9c3] to-[#4a90e2] 
              hover:bg-gradient-to-r hover:from-[#4a90e2] hover:to-[#50c9c3] 
              text-white py-3 px-4 rounded-lg font-bold 
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-[#4a90e2] mt-5 mb-5 cursor-pointer transition duration-300 
              ${loginForm.isRunning ? 'opacity-50 cursor-wait' : ''} ease-in-out`}
          >
              {loginForm.isRunning ? (
                  <>
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                  </>
              ) : (
                  <><i class="fas fa-sign-in-alt mr-2"></i>Sign In</>
              )}
            
          </button>

        </Form>
        {/* Extra Links */}
        <div class="flex justify-between text-sm mt-2">
          <a href="#" class="text-[#4a90e2] hover:underline">Forgot Password?</a>
          <a href="#" class="text-[#4a90e2] hover:underline">Create Account</a>
        </div>
      </div>
    </div>

    {/* Right (Welcome Panel) */}
    <div class="text-center w-full max-w-[400px] 
          bg-[linear-gradient(135deg,#4a90e2,#50c9c3)] 
          caret-transparent p-5 
          border-none rounded-md 
          rounded-l-none text-white
          flex flex-col items-center justify-center">
      <h2 class="text-2xl font-bold mb-4 p-4">Welcome back</h2>
      <div class="rounded-full border-4 border-white w-50 h-50 overflow-hidden flex items-center justify-center">
        <LoginPhoto alt="Login Photo" class="w-full h-full object-cover" />
      </div>

      <p class="text-white/90 mt-6">Login to access your account and manage your dashboard efficiently.</p>
    </div>
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

export const head: DocumentHead = {
  title: 'Login | Higher Career Academy (HCA).',
  meta: [
    {
      name: 'description',
      content: 'Secure login page for the Passenger Information System. Enter your credentials to access bus schedules, trip management, and administrative tools.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow', // login pages usually shouldn't be indexed
    },
    {
      name: 'author',
      content: 'Passenger Information System',
    },
  ],
};

import { RegisterForm } from './components';

export function RegisterModule() {
  return (
    <div className='w-162.5 bg-white p-10 shadow-2xl backdrop-blur-xl'>
      <h1 className='text-center text-3xl font-bold'>
        Welcome To Laxsik Ecolodge
      </h1>

      <p className='mt-2 mb-8 text-center text-sm text-gray-500'>
        Your Peaceful Nature Retreat
      </p>

      <RegisterForm />
    </div>
  );
}

import { LoginForm } from './components';

export default function LoginModule() {
  return (
    <div className='w-[650px] bg-white p-10 shadow-2xl backdrop-blur-xl'>
      <h1 className='text-center text-3xl font-bold'>
        Welcome To Laxsik Ecolodge
      </h1>

      <p className='mt-2 mb-8 text-center text-sm text-gray-500'>
        Your Peaceful Nature Retreat
      </p>

      <LoginForm />
    </div>
  );
}

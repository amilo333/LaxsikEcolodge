export default function Input( ) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="fname" className="font-bold text-[16px]">
        Name
      </label>
      <input
        type="text"
        id="fname"
        name="fname"
        placeholder="Enter your name"
        className="w-[320px] h-12 pl-2 border-[2px] border-white/30 placeholder:text-white/30"
      />
    </div>
  );
}

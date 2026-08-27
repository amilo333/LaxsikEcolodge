type TSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: TSectionHeadingProps) {
  return (
    <div className='mx-auto max-w-3xl text-center'>
      {eyebrow && (
        <p
          className={`text-xs font-bold uppercase ${light ? 'text-white/75' : 'text-[#6B837E]'}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-lora mt-3 text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl ${light ? 'text-white' : 'text-[#0D5653]'}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-sm leading-7 sm:text-base ${light ? 'text-white/78' : 'text-[#60746F]'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

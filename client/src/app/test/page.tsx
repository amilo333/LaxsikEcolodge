import { Input, Textarea } from '@/components/core';

export default function Test() {
  return (
    <div>
      <Input label="Name" />
      <Textarea label="Message" placeholder="Enter your message" />
    </div>
  );
}

import { Footer, Header } from '@/components/layouts';
import { Facilities } from '@/modules/room/components/facilities';
import { Policies } from '@/modules/room/components/policies';
import { RoomCard } from '@/modules/room/components/room-card';
import { RoomItem } from '@/modules/room/components/room-item';
import { RoomListModule } from '@/modules/room/list';

export default function RoomPage() {
  return (
    <div>
      <Header />
      <RoomListModule />
      <Facilities />
      <Policies />
      <Footer />
    </div>
  );
}

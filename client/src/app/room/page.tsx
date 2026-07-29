import { Footer, Header } from '@/components/layouts';
import { MainLayout } from '@/layouts';
import { Facilities } from '@/modules/room/common/components/facilities';
import { Policies } from '@/modules/room/common/components/policies';
import { RoomListModule } from '@/modules/room/list';

export default function RoomPage() {
  return (
    <MainLayout>
      <Header />
      <RoomListModule />
      <Facilities />
      <Policies />
      <Footer />
    </MainLayout>
  );
}

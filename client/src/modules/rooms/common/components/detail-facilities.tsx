import Image from 'next/image';
import { TRoom } from '../types/room-type';

type DetailFacilitiesProps = {
  room: TRoom;
};

const facilityDetails = (room: TRoom) => [
  {
    id: 'beds',
    icon: '/images/icon/ic-room-bed.png',
    label: 'BEDS',
    value: room.bed,
  },
  {
    id: 'occupancy',
    icon: '/images/icon/ic-room-occupancy.png',
    label: 'OCCUPANCY',
    value: `${room.capacity} adults`,
  },
  {
    id: 'size',
    icon: '/images/icon/ic-room-size.png',
    label: 'SIZE',
    value: `${room.area} m² floor plan`,
  },
  {
    id: 'bathroom',
    icon: '/images/icon/ic-room-bathroom.png',
    label: 'BATHROOM',
    value: '1 bathroom with mountain view',
  },
  {
    id: 'fireplace',
    icon: '/images/icon/ic-room-fireplace.png',
    label: 'FIREPLACE',
    value: '1 fireplace',
  },
  {
    id: 'views',
    icon: '/images/icon/ic-room-views.png',
    label: 'VIEWS',
    value: 'Window & balcony with mountain view',
  },
];

export function DetailFacilities({ room }: DetailFacilitiesProps) {
  const details = facilityDetails(room);
  const rows = [details.slice(0, 2), details.slice(2, 4), details.slice(4, 6)];

  return (
    <section className='py-16'>
      <div className='mx-auto w-full max-w-[1160px] px-6'>
        <h2 className='font-lora mb-10 text-center text-[32px] font-semibold text-[#0D4949] uppercase'>
          FACILITIES
        </h2>

        <div className='mt-12 space-y-4 divide-y'>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className='flex gap-6 border-none py-6 md:flex-row md:items-center md:justify-between'>
              {row.map((detail) => (
                <div
                  key={detail.id}
                  className='flex items-center gap-4 border-b border-[#a5a5a5] px-6 py-5 md:w-[48%]'>
                  <div className='flex h-16 w-16 items-center justify-center'>
                    <Image
                      width={28}
                      height={28}
                      src={detail.icon}
                      alt={detail.label}
                      className='h-7 w-7'
                    />
                  </div>

                  <div>
                    <div className='font-montserrat text-[18px] font-semibold uppercase'>
                      {detail.label}
                    </div>
                    <div className='font-montserrat mt-1 text-[17px] leading-6 font-normal text-[#475569]'>
                      {detail.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

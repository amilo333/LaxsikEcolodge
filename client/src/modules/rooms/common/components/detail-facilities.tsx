import Image from 'next/image';
import { TRoom } from '../types/room-type';

type DetailFacilitiesProps = {
  room: TRoom;
};

export function DetailFacilities({ room }: DetailFacilitiesProps) {
  const details = [
    {
      id: 'bed',
      icon: '/images/icon/ic-room-bed.png',
      label: 'BEDS',
      value: room.bed,
    },
    {
      id: 'capacity',
      icon: '/images/icon/ic-room-occupancy.png',
      label: 'OCCUPANCY',
      value: `${room.capacity} adults`,
    },
    {
      id: 'area',
      icon: '/images/icon/ic-room-size.png',
      label: 'SIZE',
      value: `${room.area} m² floor plan`,
    },
    {
      id: 'bathroom',
      icon: '/images/icon/ic-room-bathroom.png',
      label: 'BATHROOM',
      value: room.bathroom,
    },
    {
      id: 'fireplace',
      icon: '/images/icon/ic-room-fireplace.png',
      label: 'FIREPLACE',
      value: room.fireplace,
    },
    {
      id: 'views',
      icon: '/images/icon/ic-room-views.png',
      label: 'VIEWS',
      value: room.views,
    },
  ];

  const rows = [details.slice(0, 2), details.slice(2, 4), details.slice(4, 6)];

  return (
    <section>
      <h2 className='font-montserrat text-center text-[32px] font-medium text-[#0D4949]'>
        FACILITIES
      </h2>

      <div className='mx-auto mt-12 max-w-[1130px]'>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className='flex gap-6 md:justify-between'>
            {row.map((detail) => (
              <div
                key={detail.id}
                className='flex w-1/2 items-center gap-4 border-b border-[#a5a5a5] px-6 py-5'>
                <div className='flex h-16 w-16 shrink-0 items-center justify-center'>
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
    </section>
  );
}

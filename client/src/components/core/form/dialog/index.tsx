'use client';
import { Modal } from '@heroui/react';
import Textfield from '../textfield';
import Textarea from '../textarea';
import Button from '../button';
import { TDialogProps } from './type';

export default function Dialog(props: TDialogProps) {
  const { tourName, price } = props;

  return (
    <Modal>
      <Button className='w-[150px]! rounded-none bg-[#0D4949] font-semibold text-white'>
        BOOK NOW
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className='rounded-none sm:max-w-[400px]'>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className='text-[28px]'>BOOK TOUR</Modal.Heading>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-4'>
              <div className='bg-gray-100 p-4'>
                <p className='font-bold text-black uppercase'>{tourName}</p>
                <p className='text-[20px] font-bold text-black'>
                  {price} VNĐ
                  <span className='text-sm text-[12px] font-normal'>/PAX</span>
                </p>
              </div>

              <Textfield label='Name' />
              <Textfield label='Email' />
              <Textarea label='Message' />
            </Modal.Body>
            <Modal.Footer className='flex justify-between gap-4'>
              <Button className='w-[170px]!'>SEND</Button>
              <Button className='w-[170px]! bg-gray-200 text-black!'>
                CANCEL
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

'use client';
import { Button, Modal } from '@heroui/react';

export default function Dialog() {
  return (
    <Modal>
      <Button
        variant='secondary'
        className='rounded-none bg-[#0D4949] font-semibold text-white'>
        BOOK NOW
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className='sm:max-w-[360px]'>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>BOOK TOUR</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>
                A beautiful, fast, and modern React UI library for building
                accessible and customizable web applications with ease.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button className='w-full' slot='close'>
                Continue
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

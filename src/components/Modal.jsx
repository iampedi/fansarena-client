import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

const Modal = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="max-w-lg space-y-4 rounded-2xl bg-white p-10 min-w-96">
          <DialogTitle className="font-bold">{props.title}</DialogTitle>
          <Description>{props.description}</Description>
          {props.children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;

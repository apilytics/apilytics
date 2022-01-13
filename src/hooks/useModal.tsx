import { useOpen } from 'hooks/useOpen';

interface UseOpen {
  modalOpen: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
}

export const useModal = (): UseOpen => {
  const { open: modalOpen, handleOpen: handleOpenModal, handleClose: handleCloseModal } = useOpen();
  return { modalOpen, handleOpenModal, handleCloseModal };
};

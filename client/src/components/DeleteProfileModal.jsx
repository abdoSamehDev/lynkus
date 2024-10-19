/* eslint-disable react/prop-types */
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Modal } from "flowbite-react";
import { ErrorButton, SecondaryButton } from "./Buttons";
import { useDispatch } from "react-redux";
import { deleteUserProfile } from "../store/userSlice";
import { modalTheme } from "../utils/flowbiteThemes";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function DeleteProfileModal({ openModal, setOpenModal }) {
  const dispatch = useDispatch();
  const nav = useNavigate();
  return (
    <Modal
      theme={modalTheme}
      show={openModal}
      onClose={() => setOpenModal(false)}
      position="center"
      popup
      size="2xl"
    >
      <Modal.Header className=" bg-light-secondaryBackground dark:bg-dark-secondaryBackground rounded-t-[10px]" />

      <Modal.Body className="p-10 bg-light-secondaryBackground text-light-primaryText dark:bg-dark-secondaryBackground dark:text-dark-primaryText rounded-b-[10px]">
        <div className="text-center">
          <ExclamationCircleIcon className="mx-auto mb-4 size-14 fill-button-error dark:fill-dark-primaryText" />
          <h3 className="mb-5 text-lg font-normal ">
            Are you sure you want to delete your account?
          </h3>
          <div className="flex justify-center items-center gap-4">
            <ErrorButton
              label="Yes, I'm sure"
              onClick={async () => {
                await dispatch(deleteUserProfile()).unwrap();
                dispatch(logout());
                nav("/welcome");
                setOpenModal(false);
              }}
            />

            <SecondaryButton
              label="Cancel"
              onClick={() => setOpenModal(false)}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteProfileModal;

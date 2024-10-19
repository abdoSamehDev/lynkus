/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { Modal, Label, TextInput, Textarea } from "flowbite-react";
import { DefaultButton, SecondaryButton } from "./Buttons";
import { capitalizeName, formatImageUrl } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserProfile,
  fetchUserData,
  getUserData,
} from "../store/userSlice";
import {
  modalTheme,
  textAreaTheme,
  textInputTheme,
} from "../utils/flowbiteThemes";
import { toggleAlert } from "../store/appSlice";

const EditProfileModal = ({ openModal, setOpenModal }) => {
  const [imageFiles, setImageFiles] = useState({
    profileImg: null,
    headerImg: null,
  });
  const dispatch = useDispatch();
  const { authUserData, loading, err } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...authUserData.data,
      name: capitalizeName(authUserData.data.name),
    },
  });

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const onSubmit = async (data) => {
    setOpenModal(false);
    const formData = new FormData();

    // Append text fields
    Object.keys(data).forEach((key) => {
      if (key !== "profileImg" && key !== "headerImg") {
        formData.append(key, data[key]);
      }
    });

    // Append image files
    Object.keys(imageFiles).forEach((key) => {
      if (imageFiles[key]) {
        formData.append(key, imageFiles[key]);
      }
    });

    const objData = {};
    for (let [key, value] of formData.entries()) {
      objData[key] = value;
    }

    await dispatch(editUserProfile(objData)).unwrap();

    // After editUserProfile is fulfilled, dispatch getUserData
    await dispatch(fetchUserData(authUserData.data?.id)).unwrap();

    await dispatch(getUserData(authUserData.data?.userName)).unwrap();
    if (!loading && !err) {
      dispatch(toggleAlert());
    }
  };

  const renderImageUpload = (fieldName, label) => (
    <div>
      <Label
        htmlFor={fieldName}
        value={label}
        className="mb-2 block text-light-primaryText dark:text-dark-primaryText"
      />
      <div className="mb-2 flex items-center justify-center">
        <img
          src={
            imageFiles[fieldName]
              ? URL.createObjectURL(imageFiles[fieldName])
              : authUserData.data[fieldName]
              ? formatImageUrl(authUserData.data[fieldName], fieldName)
              : "https://placeholder.pics/svg/700/DEDEDE/DEDEDE/"
          }
          alt={`${fieldName} preview`}
          className={
            fieldName === "headerImg"
              ? "w-full h-[125px] md:h-[280px] object-cover rounded-lg"
              : "size-[150px] rounded-full object-cover"
          }
        />
      </div>
      <div className="flex items-center justify-center">
        <label
          htmlFor={fieldName}
          className="flex cursor-pointer items-center justify-center rounded-lg border border-button-default bg-transparent px-4 py-2 text-sm font-medium text-light-primaryText shadow-sm dark:text-dark-primaryText"
        >
          <PhotoIcon
            className="mr-2 h-5 w-5 text-light-primaryText dark:text-dark-primaryText"
            aria-hidden="true"
          />
          {`Change ${label}`}
        </label>
        <input
          id={fieldName}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleImageChange(e, fieldName)}
        />
      </div>
    </div>
  );

  const renderTextInput = (fieldName, label, options = {}) => (
    <div>
      <Label
        htmlFor={fieldName}
        value={label}
        className="text-light-primaryText dark:text-dark-primaryText"
      />
      <TextInput
        theme={textInputTheme}
        id={fieldName}
        type="text"
        {...register(fieldName, options)}
        className="mt-1"
        placeholder={label}
      />
      {errors[fieldName] && (
        <p className="mt-1 text-xs text-red-500">{errors[fieldName].message}</p>
      )}
    </div>
  );

  return (
    <Modal
      theme={modalTheme}
      show={openModal}
      onClose={() => setOpenModal(false)}
      size="2xl"
    >
      <Modal.Header className="border-b border-light-secondaryText bg-light-secondaryBackground dark:border-dark-secondaryText dark:bg-dark-secondaryBackground">
        <div className="flex items-center">
          <PencilSquareIcon className="mr-2 h-6 w-6 text-button-default" />
          <h3 className="text-xl font-medium text-light-primaryText dark:text-dark-primaryText">
            Edit Profile
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body className="p-10 bg-light-background text-light-primaryText dark:bg-dark-background dark:text-dark-primaryText">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderImageUpload("headerImg", "Header Image")}
          {renderImageUpload("profileImg", "Profile Picture")}
          {renderTextInput("name", "Name", { required: "Name is required" })}
          <div>
            <Label
              htmlFor="bio"
              value="Bio"
              className="text-light-primaryText dark:text-dark-primaryText"
            />
            <Textarea
              theme={textAreaTheme}
              id="bio"
              rows={4}
              {...register("bio", {
                maxLength: {
                  value: 160,
                  message: "Bio must be less than 160 characters",
                },
              })}
              className="mt-1"
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-center space-x-5 bg-light-background dark:bg-dark-background rounded-b-[10px]">
        <DefaultButton label="Save Changes" onClick={handleSubmit(onSubmit)} />
        <SecondaryButton label="Cancel" onClick={() => setOpenModal(false)} />
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;

/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Label, Textarea } from "flowbite-react";
import { DefaultButton, SecondaryButton } from "./Buttons";
import { PhotoIcon } from "@heroicons/react/24/solid";
import api, { setAuthToken } from "../utils/axios";
import cookie from "universal-cookie";

const UpdatePostModal = ({
  openModal,
  setOpenModal,
  postId,
  mybody,
  myImage,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const cookies = new cookie();
  const token = cookies.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      body: mybody,
    },
  });
  useEffect(() => {
    if (openModal) {
      setImageFile(myImage);
    }
  }, [openModal, myImage]);
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      setImageFile(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append body and authorId to the formData
      formData.append("body", data.body);

      // Append image if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }
      // Perform the PUT request to update the post using the custom api instance
      setAuthToken(token);
      const response = await api.put(`/posts/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post updated successfully:", response.data);

      // Handle success (you can show a success message, close the modal, etc.)
      setOpenModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating the post:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="lg">
      <Modal.Header>
        <h3 className="text-xl font-medium">Update Post</h3>
      </Modal.Header>
      <Modal.Body className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="body" value="Post Body" />
            <Textarea
              id="body"
              rows={4}
              placeholder="Update your post"
              {...register("body", { required: "Post body is required" })}
              className="mt-2"
            />
            {errors.body && (
              <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>
            )}
          </div>

          <div className="flex flex-col items-center">
            {typeof imageFile === "string" ? (
              <img
                src={imageFile}
                alt="Selected preview"
                className="w-full h-48 object-cover mb-4"
              />
            ) : (
              imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected preview"
                  className="w-full h-48 object-cover mb-4"
                />
              )
            )}
            <label
              htmlFor="image"
              className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium"
            >
              <PhotoIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              {imageFile ? "Change Image" : "Upload Image"}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end space-x-4">
        <SecondaryButton label="Cancel" onClick={() => setOpenModal(false)} />
        <DefaultButton label="Update Post" onClick={handleSubmit(onSubmit)} />
      </Modal.Footer>
    </Modal>
  );
};

export default UpdatePostModal;

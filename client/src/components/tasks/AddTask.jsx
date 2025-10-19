import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux"; // Added for current user
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { app } from "../../utils/firebase";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadFile = async (file) => {
  const storage = getStorage(app);
  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading...");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL); // Resolve with URL directly
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

const AddTask = ({ open, setOpen, task }) => {
  const { user } = useSelector((state) => state.auth); // Get current user for auto-team add

  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
  };
  const {
    register,
    handleSubmit,
    reset, // Added for form reset on close
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]); // Local array for files
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isUpdating }] = useUpdateTaskMutation();
  const URLS = task?.assets ? [...task.assets] : [];

  const handleOnSubmit = async (data) => {
    if (assets.length > 0) {
      setUploading(true);
      try {
        // Parallel uploads: Get all URLs at once
        const uploadPromises = Array.from(assets).map(uploadFile);
        const newUploadedURLs = await Promise.all(uploadPromises);
        URLS.push(...newUploadedURLs); // Append to existing
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Auto-add current user to team if not already included (fixes Dashboard visibility)
    const userId = user?._id || user?.id; // Fallback: try _id first, then id
    const updatedTeam = userId ? [...new Set([...team, userId])] : team; // Skip if no valid ID

    const newData = {
      ...data,
      assets: URLS,
      team: updatedTeam,
      stage,
      priority,
    };

    console.log("Submitting data:", newData); // Keep for debugging

    try {
      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);
      reset(); // Reset form
      setTimeout(() => setOpen(false), 500); // Close modal
    } catch (err) {
      console.error("Mutation error:", err);
      toast.error(err?.data?.message || err.error || "Something went wrong.");
    }
  };

  const handleSelect = (e) => {
    setAssets(Array.from(e.target.files)); // Convert FileList to array
  };

  // Reset form when modal closes
  const handleClose = () => {
    reset();
    setAssets([]);
    setOpen(false);
  };

  return (
    <ModalWrapper open={open} setOpen={handleClose}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          {task ? "UPDATE TASK" : "ADD TASK"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />
          <UserList setTeam={setTeam} team={team} />
          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />
            <SelectList
              label="Priority Level"
              lists={PRIORIRY}
              selected={priority}
              setSelected={setPriority}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
            <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          <div className="w-full">
            <p>Task Description</p>
            <textarea
              name="description"
              {...register("description")}
              className="w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white outline-none text-base focus:ring-2 ring-blue-300"
              rows={4}
            ></textarea>
          </div>

          <div className="w-full">
            <p>
              Add Links{" "}
              <span className="text-gray-600">separated by comma (,)</span>
            </p>
            <textarea
              name="links"
              {...register("links")}
              className="w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white outline-none text-base focus:ring-2 ring-blue-300"
              rows={2}
            ></textarea>
          </div>
        </div>

        {(isLoading || isUpdating || uploading) ? (
          <div className="py-4">
            <Loading />
          </div>
        ) : (
          <div className="bg-gray-50 mt-6 mb-4 sm:flex sm:flex-row-reverse gap-4">
            <Button
              label="Submit"
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              disabled={uploading} // Disable during upload
            />
            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={handleClose}
              label="Cancel"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
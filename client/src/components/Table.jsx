import clsx from "clsx";
import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { useTrashTastMutation } from "../redux/slices/api/taskApiSlice.js";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils/index.js";

import { Link } from "react-router-dom";
import { Button, ConfirmatioDialog, UserInfo } from "./index";
import { AddTask, TaskAssets, TaskColor } from "./tasks";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [deleteTask] = useTrashTastMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: selected,
      }).unwrap();

      toast.success(res?.message);
      setOpenDialog(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  // Updated TableHeader: Use map to render <th> without whitespace between them
  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300 dark:border-gray-600'>
      <tr className='w-full text-black dark:text-white text-left'>
        {[
          { label: 'Task Title', className: 'py-2' },
          { label: 'Priority', className: 'py-2' },
          { label: 'Created At', className: 'py-2' },
          { label: 'Assets', className: 'py-2' },
          { label: 'Team', className: 'py-2' },
          { label: '', className: 'py-2' }, // Actions column
        ].map((header, index) => (
          <th key={index} className={header.className}>
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Updated TableRow: Use map to render <td> without whitespace between them
  const TableRow = ({ task }) => {
    const cells = [
      // Task Title cell
      (
        <td key='title' className='py-2'>
          <Link to={`/task/${task._id}`}>
            <div className='flex items-center gap-2'>
              <TaskColor className={TASK_TYPE[task.stage]} />
              <p className='w-full line-clamp-2 text-base text-black dark:text-white'>
                {task?.title}
              </p>
            </div>
          </Link>
        </td>
      ),
      // Priority cell
      (
        <td key='priority' className='py-2'>
          <div className={"flex gap-1 items-center"}>
            <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
              {ICONS[task?.priority]}
            </span>
            <span className='capitalize line-clamp-1'>
              {task?.priority} Priority
            </span>
          </div>
        </td>
      ),
      // Created At cell
      (
        <td key='date' className='py-2'>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(task?.date))}
          </span>
        </td>
      ),
      // Assets cell
      (
        <td key='assets' className='py-2'>
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks?.length}
            assets={task?.assets?.length}
          />
        </td>
      ),
      // Team cell
      (
        <td key='team' className='py-2'>
          <div className='flex'>
            {task?.team?.map((m, index) => (
              <div
                key={m._id}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>
      ),
      // Actions cell
      (
        <td key='actions' className='py-2 flex gap-2 md:gap-4 justify-end'>
          <Button
            className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
            label='Edit'
            type='button'
            onClick={() => editClickHandler(task)}
          />
          <Button
            className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
            label='Delete'
            type='button'
            onClick={() => deleteClicks(task._id)}
          />
        </td>
      ),
    ];

    return (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
        {cells}
      </tr>
    );
  };

  return (
    <>
      <div className='bg-white dark:bg-[#1f1f1f] px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full '>
            <TableHeader />
            <tbody>
              {tasks?.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task._id} task={task} />
                ))
              ) : (
                <tr className='text-center'>
                  <td className='py-4' colSpan='6'>No Tasks Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
};

export default Table;
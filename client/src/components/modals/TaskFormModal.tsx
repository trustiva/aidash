import React from 'react';
import TaskForm from '../forms/TaskForm';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
  isEdit?: boolean;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, task, isEdit = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <TaskForm 
          onClose={onClose} 
          task={task}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
};

export default TaskFormModal;
import { format } from 'date-fns';
import { Calendar, Trash2, Edit2, GripVertical, CheckCircle2, Circle } from 'lucide-react';

function TaskItem({ task, provided, snapshot, onDelete, onToggleStatus }) {
  const isCompleted = task.status === 'completed';

  const priorityColors = {
    high: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{ ...provided.draggableProps.style }}
      className={`p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
        snapshot.isDragging ? 'border-indigo-500 shadow-md' : 'border-gray-200 dark:border-gray-700'
      } flex items-start gap-3 group transition-colors duration-200 ${isCompleted ? 'opacity-75' : ''}`}
    >
      <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1 cursor-grab">
        <GripVertical size={20} />
      </div>
      
      <button 
        onClick={() => onToggleStatus(task)} 
        className={`mt-1 flex-shrink-0 ${isCompleted ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
      >
        {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className={`text-base font-medium truncate ${isCompleted ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </h4>
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className={`mt-1 text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'} line-clamp-2`}>
            {task.description}
          </p>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
            {task.dueDate && (
              <>
                <Calendar size={14} />
                <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition" title="Edit coming soon">
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import FilterStats from '../components/FilterStats';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const query = new URLSearchParams();
        if (filterStatus !== 'all') query.append('status', filterStatus);
        if (searchQuery) query.append('search', searchQuery);
        if (sortBy) query.append('sortby', sortBy);

        const { data } = await axios.get(`http://localhost:5001/api/tasks?${query.toString()}`, config);
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };
    
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [user, filterStatus, searchQuery, sortBy]);

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskDeleted = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5001/api/tasks/${id}`, config);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`http://localhost:5001/api/tasks/${task._id}`, { ...task, status: newStatus }, config);
      setTasks(prev => prev.map(t => t._id === data._id ? data : t));
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Moved from pending to completed or vice versa
      const newStatus = destination.droppableId;
      
      // Update local state instantly
      const updatedTasks = tasks.map(t => {
        if (t._id === draggableId) {
          return { ...t, status: newStatus };
        }
        return t;
      });
      setTasks(updatedTasks);
      
      // Sync with server
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const taskToUpdate = tasks.find(t => t._id === draggableId);
        await axios.put(`http://localhost:5001/api/tasks/${draggableId}`, { ...taskToUpdate, status: newStatus }, config);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading || !user) return null;

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <TaskForm onTaskAdded={handleTaskAdded} />
            <FilterStats 
              tasks={tasks}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          <div className="lg:col-span-2">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Pending Column */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex justify-between">
                    <span>Pending</span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">{pendingTasks.length}</span>
                  </h3>
                  <Droppable droppableId="pending">
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/10 border border-dashed border-indigo-300 dark:border-indigo-700' : ''}`}
                      >
                        {pendingTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <TaskItem 
                                task={task} 
                                provided={provided} 
                                snapshot={snapshot}
                                onDelete={handleTaskDeleted}
                                onToggleStatus={handleToggleStatus}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Completed Column */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex justify-between">
                    <span>Completed</span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">{completedTasks.length}</span>
                  </h3>
                  <Droppable droppableId="completed">
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/10 border border-dashed border-indigo-300 dark:border-indigo-700' : ''}`}
                      >
                        {completedTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <TaskItem 
                                task={task} 
                                provided={provided} 
                                snapshot={snapshot}
                                onDelete={handleTaskDeleted}
                                onToggleStatus={handleToggleStatus}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

              </div>
            </DragDropContext>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;

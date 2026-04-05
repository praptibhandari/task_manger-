const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const { status, search, sortby } = req.query;
    
    // Base query
    const query = { user: req.user._id };
    
    // Filtering
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Build the mongoose query
    let tasksQuery = Task.find(query);

    // Sorting
    if (sortby === 'dueDate') {
      tasksQuery = tasksQuery.sort({ dueDate: 1 });
    } else if (sortby === 'priority') {
      // Sort priority alphabetically: high, low, medium. Not perfect but works for string sort.
      tasksQuery = tasksQuery.sort({ priority: 1 });
    } else {
      // Default to latest
      tasksQuery = tasksQuery.sort({ createdAt: -1 }); 
    }

    const tasks = await tasksQuery;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/tasks
// @desc    Create a task
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check for user ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    res.json({ id: req.params.id, message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

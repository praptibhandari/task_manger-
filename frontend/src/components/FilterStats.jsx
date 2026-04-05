function FilterStats({ 
  tasks, 
  filterStatus, setFilterStatus,
  searchQuery, setSearchQuery,
  sortBy, setSortBy
}) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {['all', 'pending', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition ${
                  filterStatus === status 
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 border-t dark:border-gray-700 pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
        </div>
        <div className="text-center border-l border-r dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completed}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{pending}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
        </div>
      </div>
    </div>
  );
}

export default FilterStats;

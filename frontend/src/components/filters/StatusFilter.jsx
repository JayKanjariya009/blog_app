const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = ['All', 'Ongoing', 'Completed', 'Hiatus', 'Cancelled'];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Status</label>
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-sm"
      >
        {statuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
  );
};

export default StatusFilter;
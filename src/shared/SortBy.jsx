function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div>
      <label htmlFor='sort-by'>Sort by</label>
      <select
        name='sort-by'
        id='sort-by'
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value='createdAt'>Created At</option>
        <option value='title'>Title</option>
      </select>

      <label htmlFor='order-by'>Order</label>
      <select
        name='order-by'
        id='order-by'
        value={sortDirection}
        onChange={(e) => onSortDirectionChange(e.target.value)}
      >
        <option value='desc'>Descending</option>
        <option value='asc'>Ascending</option>
      </select>
    </div>
  );
}

export default SortBy;

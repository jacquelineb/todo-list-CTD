import styles from './SortBy.module.css';

function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div className={styles.sortBy}>
      <div className={styles.sortGroup}>
        <label htmlFor='sort-by'>Sort By:</label>
        <select
          name='sort-by'
          id='sort-by'
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value='createdAt'>Created At</option>
          <option value='title'>Title</option>
        </select>
      </div>

      <div className={styles.sortGroup}>
        <label htmlFor='order-by'>Order:</label>
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
    </div>
  );
}

export default SortBy;

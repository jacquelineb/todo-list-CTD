import { MAX_TODO_LENGTH } from '../utils/constants.js';
import styles from './FilterInput.module.css';

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.filterInput}>
      <label htmlFor='filterInput'>Search todos:</label>
      <input
        id='filterInput'
        type='text'
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder='Search by title...'
        maxLength={MAX_TODO_LENGTH}
      />
    </div>
  );
}

export default FilterInput;

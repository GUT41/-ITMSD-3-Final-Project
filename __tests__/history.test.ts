import { useSearchStore } from '../src/store/searchStore';

describe('Search History', () => {
  beforeEach(() => {
    useSearchStore.setState({ searchHistory: [] });
  });

  test('should add query to history', () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory('apple');
    const history = useSearchStore.getState().searchHistory;
    expect(history[0]).toBe('apple');
  });

  test('should limit history to 10 items', () => {
    const { addToHistory } = useSearchStore.getState();
    for (let i = 0; i < 15; i++) {
      addToHistory(`word${i}`);
    }
    const history = useSearchStore.getState().searchHistory;
    expect(history.length).toBe(10);
  });

  test('should not duplicate history items', () => {
    const { addToHistory } = useSearchStore.getState();
    addToHistory('test');
    addToHistory('test');
    const history = useSearchStore.getState().searchHistory;
    expect(history.filter((h) => h === 'test').length).toBe(1);
  });

  test('should clear history', () => {
    const { addToHistory, clearHistory } = useSearchStore.getState();
    addToHistory('apple');
    clearHistory();
    const history = useSearchStore.getState().searchHistory;
    expect(history.length).toBe(0);
  });
});

// useRefresh.js (Custom Hook)
import { useState, useCallback } from 'react';

const useRefresh = () => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = useCallback(() => {
    // setRefresh((prev) => !prev);
    setRefresh(true);
  }, []);

  return { refresh, triggerRefresh };
};

export default useRefresh;

import { ref, get } from 'firebase/database';
import { database } from './FireBaseConnection';

class DatabaseController {
    fetchNodeData = async (nodePath: string) => {
      try {
        const nodeRef = ref(database, nodePath);
        const snapshot = await get(nodeRef);
    
        if (snapshot.exists()) {
          const data = snapshot.val();
          return data; // Return the fetched data
        } else {
          console.log('No data found at the specified node.');
          return null; // Or handle the case where data is not found
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Or handle the error appropriately
      }
    };
    
}

export default DatabaseController;
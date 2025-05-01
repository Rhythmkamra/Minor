import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'yX3-RIX8UWqoYsbEMYvYa_3oOEI445knZvDaY7UFRSY'; // Replace with your actual Unsplash access key

export const fetchLocationImage = async (query) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;
    if (results.length > 0) {
      return results[0].urls.regular;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return null;
  }
};

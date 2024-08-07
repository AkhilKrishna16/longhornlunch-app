import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000'
const MAX_RETRIES = 5
const RETRY_DELAY = 1000


export const fetchWithRetry = async (url = API_BASE_URL, retries = MAX_RETRIES): Promise<any> => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying ... ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}`)
      await new Promise(res => setTimeout(res, RETRY_DELAY))
      return fetchWithRetry(url, retries - 1)
    } else {
      console.error('Max retries reached.')
      throw error
    }
  }
}

export const fetchDiningHalls = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return_location_halls`)
    console.log('dining halls')
    return response.data
  } catch (error) {
    console.error(`Error fetching data`, error)
    return []
  }
}

export const fetchDatesForDiningHall = async (diningHall: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return_dates/${diningHall}`);
    console.log('dates')
    return response.data
  } catch (error) {
    console.error(`Error fetching dates for dining hall ${diningHall}:`, error)
    return []
  }
}

export const fetchMenuDataForJ2Dining = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return_meals/J2 Dining/Wednesday, June 31`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu data for dining hall ${'J2 Dining'} on date ${'June 31st'}:`, error);
    return null;
  }
};

export const fetchMenuData = async (diningHall: string, date: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return_meals/${diningHall}/${date}`, {
    });
    console.log('Fetched Menu Data')
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu data for dining hall ${diningHall} on date ${date}:`, error);
    return null;
  }
};

export const handleUpvote = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/handle_upvote/${id}`)
    return response.data.vote_count
  } catch (error) {
    console.error('Error upvoting the data.')
    return null
  }
}

export const handleDownvote = async (id: number) => {
  try {
    console.log(id)
    const response = await axios.get(`${API_BASE_URL}/handle_downvote/${id}`)
    return response.data.vote_count
  } catch (error) {
    console.error('Error upvoting the data.')
    return null
  }
}
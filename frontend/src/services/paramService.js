import fetchWithAuth from '../utils/fetchWithAuth'; // Ensure the path is correct

const URL_API = process.env.REACT_APP_API_URL;

class ParamService {
  async getByUserId(id) {
    try {
      const response = await fetchWithAuth(`${URL_API}/params/user/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(param) {
    try {
      const response = await fetchWithAuth(`${URL_API}/params`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(updates) {
    try {
      const response = await fetchWithAuth(`${URL_API}/params/updateEventAuto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetchWithAuth(`${URL_API}/params/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getDateServer(){
  try {
    const response = await fetchWithAuth(`${URL_API}/api/dates`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async updateDate(date) {
  try {
    const response = await fetchWithAuth(`${URL_API}/params/updateDate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
}



const paramServiceInstance = new ParamService();

export default paramServiceInstance;
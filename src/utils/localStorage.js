// utils/localStorage.js

// Save functions
export const setLocalToken = (currToken) => {
    localStorage.setItem("colab32Access", currToken);
};

export const setLocalUserId = (currUserId) => {
    localStorage.setItem("colab32Uid", currUserId);
};

export const setLocalCurrDogId = (currDogId) => {
    localStorage.setItem("colab32DogUid", currDogId);
};

export const setLocalUser = (currUser) => {
    localStorage.setItem("colab32User", JSON.stringify(currUser)); // Convert object to string
};

export const setLocalDogProfile = (dogProfile) => {
    localStorage.setItem("colab32DogProfile", JSON.stringify(dogProfile)); // Convert object to string
};

// Get functions
export const getToken = () => {
    const token = localStorage.getItem("colab32Access");
    console.log('token', token)
};

export const getUserId = () => localStorage.getItem("colab32Uid");

export const getCurrDogId = () => localStorage.getItem("colab32DogUid");

export const getUser = () => {
    const user = localStorage.getItem("colab32User");
    return user ? JSON.parse(user) : null; // Parse back to object
};

export const getDogProfile = () => {
    const dogProfile = localStorage.getItem("colab32DogProfile");
    return dogProfile ? JSON.parse(dogProfile) : null; // Parse back to object
};

// Remove functions
export const removeLocalToken = () => localStorage.removeItem("colab32Access");

export const removeLocalUserId = () => localStorage.removeItem("colab32Uid");

export const removeLocalCurrDogId = () =>
    localStorage.removeItem("colab32DogUid");

export const removeLocalUser = () => localStorage.removeItem("colab32User");

export const removeLocalDogProfile = () =>
    localStorage.removeItem("colab32DogProfile");

// Clear all relevant localStorage data
export const clearAllLocalStorage = () => {
    removeLocalToken();
    removeLocalUserId();
    removeLocalCurrDogId();
    removeLocalUser();
    removeLocalDogProfile();
};

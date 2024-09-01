export const setLocalToken = (token) => {
    localStorage.setItem("colab32Access", token);
};

export const getToken = () => {
    return localStorage.getItem("colab32Access");
}
    ;
export const removeToken = () => {
    localStorage.removeItem("colab32Access");
};

export const setLocalUserId = (UserId) => {
    localStorage.setItem("colab32Uid", UserId);
};

export const getUserId = () => {
    return localStorage.getItem("colab32Uid");
};
export const removeUserId = () => {
    localStorage.removeItem("colab32Uid");
};

export const setLocalCurrDogId = (currDogUid) => {
    localStorage.setItem("colab32DogUid", currDogUid);
};

export const getCurrDogId = () => {
    return localStorage.getItem("colab32DogUid");
};
export const removeCurrDogId = () => {
    localStorage.removeItem("colab32DogUid");
};

export const setLocalUser = (user) => {
    localStorage.setItem("colab32User", user);
};

export const getUser = () => {
    return localStorage.getItem("colab32User");
};
export const removeUser = () => {
    localStorage.removeItem("colab32User");
};


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



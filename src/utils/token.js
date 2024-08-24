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
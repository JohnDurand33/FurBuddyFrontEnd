export const setToken = (token) => {
    localStorage.setItem('COLAB32authtoken', token)
};

export const getToken = () => {
    return localStorage.getItem("COLAB32authtoken");
}
    ;
export const removeToken = () => {
    localStorage.removeItem("COLAB32authtoken");
};
export const setToken = (token) => {
    sessionStorage.setItem('COLAB32authtoken', token)
};

export const getToken = () => {
    return sessionStorage.getItem('COLAB32authtoken')
}
    ;
export const removeToken = () => {
    sessionStorage.removeItem('COLAB32authtoken')
};
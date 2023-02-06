export const getLocalStorage = () => {
    const getItem = (keyName: string) => {
        return window.localStorage.get
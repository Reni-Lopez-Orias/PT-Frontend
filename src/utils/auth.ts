export const isAuthenticated = (): boolean => {  
  return !!sessionStorage.getItem('token'); // y si el token es valido
};

export const setAuthenticationSession= (token: string) => sessionStorage.setItem('token', token);
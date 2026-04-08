import { createContext, useContext } from "react";

export const ToastContext = createContext();
/**
 * @returns {{
 *  showToast: function(Omit<ToastData, 'id' | 'show'>): void;
 * }} 
 */
export const useToast = () => useContext(ToastContext);
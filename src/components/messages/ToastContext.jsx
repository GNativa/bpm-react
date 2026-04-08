import { createContext, useContext } from "react";

/** @import {ToastData} from "../../logic/types" */

export const ToastContext = createContext();
/**
 * @returns {{
 *  showToast: function(Omit<ToastData, 'id' | 'show'>): void;
 * }} 
 */
export const useToast = () => useContext(ToastContext);
import { useState, useCallback } from "react";
import { ToastContext, useToast } from "./ToastContext";
import { Toast, ToastContainer } from "react-bootstrap";

/** @import {ToastData} from "../../logic/types" */

let idCounter = 0;

export default function ToastProvider({ children }) {
    /**
     * @type {ToastData[]}
     */
    const initialToasts = [];
    const [toasts, setToasts] = useState(initialToasts);

    /**
     * @param {Omit<ToastData, 'id' | 'show'>} 
     */
    function addToast({
        variant, title, message, autohide = false, delay,
    }) {
        const id = idCounter;
        idCounter++;

        setToasts((previous) => {
            return [...previous, {
                show: true,
                id: id,
                variant,
                title,
                message,
                autohide,
                delay,
            }];
        });

        setTimeout(() => {
            removeToast(id);
        }, 120000)
    }

    function removeToast(id) {
        setToasts((previousToasts) => {
            return [...previousToasts].filter(t => t.id !== id);
        });
    }

    const showToast = useCallback(addToast, []);

    /**
     * @param {number} index 
     */
    function closeToast(index) {
        const copy = [...toasts];
        copy[index].show = false;
        setToasts(copy);
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <ToastContainer position="top-end" className="p-1">
                {toasts.map((t, index) => (
                    <Toast
                        key={t.id}
                        bg={t.variant}
                        autohide={t.autohide}
                        delay={t.autohide ? (t.delay ?? 5000) : undefined}
                        show={t.show}
                        onClose={() => closeToast(index)}
                    >
                        <Toast.Header closeButton={!t.autohide}>
                            <div className="d-flex justify-content-start w-100">
                                <div className="text-start">
                                    {t.title}
                                </div>
                            </div>
                        </Toast.Header>
                        <Toast.Body className="d-flex justify-content-start fs-6">
                            {t.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}



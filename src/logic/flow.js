export const currentStep = getCurrentStep();

export default function flowInfo() {
    return {
        getCurrentStep, currentStepIs
    };
}

export function currentStepOrNone(step) {
    return step || step === currentStep;
}

export function currentStepIs(step) {
    return step === currentStep;
}

export function getCurrentStep() {
    const url = new URL(window.location.toLocaleString());
    const parametros = url.searchParams;
    return parametros.get("step");
}
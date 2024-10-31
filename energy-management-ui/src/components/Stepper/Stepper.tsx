import {MdDone} from "react-icons/md";

type StepsDirection = "row" | "column";

type StepperProps = {
    steps: number,
    currentStep: number,
    stepsDirection: StepsDirection,
}

export default function Stepper({steps, currentStep, stepsDirection}: StepperProps) {
    const wrapperStyle = `flex ${stepsDirection === "column" ? "flex-col" : "flex-row"} justify-start items-center transition-all duration-150`;

    const stepStyle = "w-12 h-12 rounded-full border-4 border-primary-color flex items-center justify-center box-border text-background-reverse text-xl font-bold";
    const doneStepStyle = "w-12 h-12 rounded-full bg-primary-color flex items-center justify-center";

    const renderStep = (step: number) => {
        if (step < steps) {
            return <div className={`${wrapperStyle} flex-grow`} key={`wrapper-${step}`}>
                <div className={currentStep < step ? stepStyle : doneStepStyle} key={step}>
                    {currentStep < step ?
                        <span>{step}</span> :
                        <MdDone size={26} className="text-white"/>
                    }
                </div>
                <div
                    className={`flex-grow ${stepsDirection === "column" ? "w-0.5 my-2" : "h-0.5 mx-2"} ${currentStep < step ? "bg-primary-color/65" : "bg-primary-color"}`}>
                </div>
            </div>;
        }
        return <div className={wrapperStyle} key={`wrapper-${step}`}>
            <div className={currentStep < step ? stepStyle : doneStepStyle} key={step}>
                {currentStep < step ?
                    <span>{step}</span> :
                    <MdDone size={26} className="text-white"/>
                }
            </div>
        </div>;
    }

    return (
        <div className={`flex ${stepsDirection === "column" ? "flex-col h-full" : "flex-row w-full"} items-center justify-around`}>
            {
                Array.from({length: steps}).map((_, step) => renderStep(step + 1))
            }
        </div>
    );
}
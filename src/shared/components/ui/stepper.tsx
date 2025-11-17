import { cn } from "@/shared/lib/cn";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description?: string }[];
}

export const Stepper = ({ currentStep, totalSteps, steps }: StepperProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = stepNumber === totalSteps;

          return (
            <div key={stepNumber} className={
              cn("flex items-center", {
                "flex-1": !isLast,
              })
            }>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                    {
                      "bg-blue-600 border-blue-600 text-white": isActive,
                      "bg-green-600 border-green-600 text-white": isCompleted,
                      "border-gray-300 text-gray-500": !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      {
                        "text-blue-600": isActive,
                        "text-green-600": isCompleted,
                        "text-gray-500": !isActive && !isCompleted,
                      }
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    {
                      "bg-green-600": isCompleted,
                      "bg-gray-300": !isCompleted,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

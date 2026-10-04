import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  completed?: boolean;
  current?: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step.completed
                  ? "bg-green-500 text-white"
                  : step.current
                  ? "bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
              )}
            >
              {step.completed ? "✓" : index + 1}
            </div>
            <span
              className={cn(
                "mt-2 text-xs text-center",
                step.current ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2",
                step.completed ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

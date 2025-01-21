interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  label: string;
}

export function ProgressSteps({ currentStep, totalSteps, label }: ProgressStepsProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex-1 max-w-[150px] h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-600" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
} 
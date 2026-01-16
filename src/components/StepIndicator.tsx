interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          {/* Circle */}
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
            ${step === currentStep 
              ? 'bg-blue-600 text-white' 
              : step < currentStep 
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }
          `}>
            {step < currentStep ? '✓' : step}
          </div>
          
          {/* Line between steps */}
          {step < totalSteps && (
            <div className={`w-16 h-1 ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

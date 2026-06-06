export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-base via-white to-medical/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-medical rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-2xl">C2</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Clinic2Report</h1>
          <p className="text-text-secondary mt-2">Medical consultation insights, made simple</p>
        </div>
        {children}
      </div>
    </div>
  );
}  

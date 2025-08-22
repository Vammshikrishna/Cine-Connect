import { ProfileSetup } from "@/components/onboarding/profile-setup"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to CineCraft Connect!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Let's set up your profile to help you connect with the right people
          </p>
        </div>

        <ProfileSetup />
      </div>
    </div>
  )
}

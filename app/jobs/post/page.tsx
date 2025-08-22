import { PostJobForm } from "@/components/jobs/post-job-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/jobs" className="flex items-center gap-2 text-blue-600 hover:text-blue-500">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Post a New Job</h1>
          <p className="text-slate-600 dark:text-slate-400">Connect with talented film industry professionals</p>
        </div>

        <PostJobForm />
      </div>
    </div>
  )
}

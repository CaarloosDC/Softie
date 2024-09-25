"use client"
export default function ErrorPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-center mb-8">
          An error occurred during the confirmation process. Please try again or contact support.
        </p>
      </div>
    )
  }
import FaceRecorder from '@/components/FaceRecorder'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Face Detection & Recording</h1>
      <FaceRecorder />
    </main>
  )
}

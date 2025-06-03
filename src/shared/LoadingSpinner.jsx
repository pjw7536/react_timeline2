export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center" role="status">
      <div className="animate-spin rounded-full h-5 w-5 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}

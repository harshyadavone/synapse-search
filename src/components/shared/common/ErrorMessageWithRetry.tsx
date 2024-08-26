const ErrorMessageWithRetry: React.FC<{
  message: string;
  onRetry: () => void;
  retryCount: number;
}> = ({ message, onRetry, retryCount }) => (
  <div className="text-center text-red-500 p-4 bg-destructive/10 rounded-md">
    <p className="font-bold">Error</p>
    <p>{message}</p>
    {retryCount < 3 && <p>Retrying... (Attempt {retryCount + 1}/3)</p>}
    {retryCount >= 3 && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-card/50 hover:bg-card text-red-500 rounded"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessageWithRetry;

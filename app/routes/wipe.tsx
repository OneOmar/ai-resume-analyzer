import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  // Load all files in the root directory
  const loadFiles = async () => {
    const list = (await fs.readDir("./")) as FSItem[];
    setFiles(list);
  };

  // Fetch files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  // Delete all files & flush KV store
  const handleDelete = async () => {
    await Promise.all(files.map((file) => fs.delete(file.path)));
    await kv.flush();
    await loadFiles();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="p-6">
      <h1 className="text-lg font-bold mb-4">Wipe App Data</h1>

      <p className="mb-2">Authenticated as: {auth.user?.username}</p>
      <h2 className="font-semibold">Existing files:</h2>

      <div className="flex flex-col gap-2 my-4">
        {files.length > 0 ? (
          files.map((file) => (
            <span key={file.id} className="text-gray-700">
              {file.name}
            </span>
          ))
        ) : (
          <p className="text-gray-500">No files found</p>
        )}
      </div>

      <button
        onClick={handleDelete}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Wipe App Data
      </button>
    </main>
  );
};

export default WipeApp;

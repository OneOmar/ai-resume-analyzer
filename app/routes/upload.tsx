import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage, type PdfConversionResult } from "~/lib/pdfToImage";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

// Form data for analysis
interface AnalysisData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

// Data stored in key-value store
interface ResumeData {
  id: string;
  resumePath: string;
  imagePath: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  feedback: string;
}

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Update status message
  const updateStatus = (text: string) => setStatusText(text);

  // Handle file selection
  const handleFileSelect = (selectedFile: File | null) => {
    console.log("File selected:", selectedFile);
    setFile(selectedFile);
  };

  // Upload file to storage
  const uploadFile = async (file: File): Promise<string | null> => {
    const uploaded = await fs.upload([file]);
    console.log("Uploaded file:", uploaded);
    return uploaded?.path || null;
  };

  // Save resume data in KV store
  const saveResumeData = async (uuid: string, data: ResumeData) => {
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
  };

  // Get AI feedback
  const getAIFeedback = async (resumePath: string, instructions: string) => {
    const response = await ai.feedback(resumePath, instructions);
    if (!response) return null;

    const content =
      typeof response.message?.content === "string"
        ? response.message.content
        : response.message?.content?.[0]?.text;

    return content ? JSON.parse(content) : null;
  };

  // Main analysis workflow
  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: AnalysisData) => {
    setIsProcessing(true);

    try {
      // Step 1: Upload PDF
      updateStatus("Uploading the file...");
      const resumePath = await uploadFile(file);
      if (!resumePath) throw new Error("Failed to upload PDF");

      // Step 2: Convert PDF to image
      updateStatus("Converting to image...");
      const imageFile: PdfConversionResult = await convertPdfToImage(file);

      if (!imageFile.file) {
        console.error("PDF conversion error:", imageFile.error);
        updateStatus(`Error: ${imageFile.error || "Failed to convert PDF to image"}`);
        setIsProcessing(false);
        return;
      }

      // Step 3: Upload image
      updateStatus("Uploading the image...");
      const imagePath = await uploadFile(imageFile.file);
      if (!imagePath) throw new Error("Failed to upload image");

      // Step 4: Save initial data
      updateStatus("Preparing data...");
      const uuid = generateUUID();
      const data: ResumeData = {
        id: uuid,
        resumePath,
        imagePath,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await saveResumeData(uuid, data);

      // Step 5: AI feedback
      updateStatus("Analyzing...");
      const feedback = await getAIFeedback(
        resumePath,
        prepareInstructions({ jobTitle, jobDescription })
      );

      console.log("AI feedback response:", feedback);

      if (!feedback) throw new Error("Failed to analyze resume");

      // Step 6: Save final feedback
      data.feedback = feedback;
      await saveResumeData(uuid, data);

      updateStatus("Analysis complete, redirecting...");
      console.log(data);

      // TODO: Navigate to feedback page
      navigate(`/feedback/${uuid}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      updateStatus(`Error: ${message}`);
      setIsProcessing(false);
      console.error("Error in handleAnalyze:", err);
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      updateStatus("Please select a file");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const analysisData: AnalysisData = {
      companyName: formData.get("company-name") as string,
      jobTitle: formData.get("job-title") as string,
      jobDescription: formData.get("job-description") as string,
      file,
    };

    console.log("Starting analysis with data:", analysisData);
    handleAnalyze(analysisData);
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                className="w-full"
                alt="Scanning resume"
              />
            </>
          ) : (
            <>
              <h2>Drop your resume for an ATS score and improvement tips</h2>
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-8"
              >
                {/* Company Name */}
                <div className="form-div">
                  <label htmlFor="company-name">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    name="company-name"
                    placeholder="Company Name"
                    required
                  />
                </div>

                {/* Job Title */}
                <div className="form-div">
                  <label htmlFor="job-title">Job Title</label>
                  <input
                    id="job-title"
                    type="text"
                    name="job-title"
                    placeholder="Job Title"
                    required
                  />
                </div>

                {/* Job Description */}
                <div className="form-div">
                  <label htmlFor="job-description">Job Description</label>
                  <textarea
                    id="job-description"
                    name="job-description"
                    rows={5}
                    placeholder="Job Description"
                    required
                  />
                </div>

                {/* Resume Upload */}
                <div className="form-div">
                  <label htmlFor="uploader">Upload Resume</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                  {file && (
                    <p className="text-sm text-green-600">Selected: {file.name}</p>
                  )}
                </div>

                <button type="submit" className="primary-button">
                  Analyse Resume
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;

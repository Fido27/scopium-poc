"use client";
import { useState } from "react";
import { encryptFile, decryptFile } from "./crypto";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const handleUpload = async () => {
    if (!file || !password) return;
    const encryptedBlob = await encryptFile(file, password);
    const formData = new FormData();
    formData.append("file", new File([encryptedBlob], file.name));

    await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
  };

  const handleDownload = async () => {
    const res = await fetch("http://localhost:8000/download/" + file?.name);
    const blob = await res.blob();
    const decryptedBlob = await decryptFile(blob, password);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(decryptedBlob);
    a.download = file?.name || "decrypted";
    a.click();
  };

  return (
    <div className="text-center text-5xl p-56">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
	  <br/>
	  <br/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
	  <br/>
	  <br/>
      <button onClick={handleUpload}>Encrypt & Upload</button>
	  <br/>
	  <br/>
      <button onClick={handleDownload}>Download & Decrypt</button>
    </div>
  );
}

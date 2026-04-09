"use client";

import React, { useState } from 'react';

interface Props {
  onSuccess: (url: string) => void;
  className?: string;
  folder?: string;
  buttonLabel?: string;
  preset?: string;
}

export default function ImageUpload({ onSuccess, className = "", folder = "avatars", buttonLabel = "Upload", preset = "" }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);

    try {
      // 1. Get Signature from backend
      const queryParams = new URLSearchParams();
      if (preset) queryParams.append('preset', preset);
      if (folder) queryParams.append('folder', folder);
      
      const sigRes = await fetch(`/api/cloudinary-sign?${queryParams.toString()}`);
      if (!sigRes.ok) throw new Error("Failed to get signature");
      const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

      // 2. Upload directly to Cloudinary from browser
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      if (preset) formData.append('upload_preset', preset);
      if (folder) formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        let errStr = "Failed to upload to Cloudinary";
        try {
          const errData = await uploadRes.json();
          console.error("Cloudinary Error Payload:", errData);
          errStr = errData?.error?.message || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }
      const data = await uploadRes.json();
      
      onSuccess(data.secure_url);
    } catch (error) {
      console.error(error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="flex items-center justify-center w-full h-full cursor-pointer group">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
        />
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-inherit">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity opacity-0 bg-black/50 rounded-inherit group-hover:opacity-100">
            <span className="text-xl">📷</span>
            <span className="text-xs font-semibold text-white">Upload</span>
          </div>
        )}
      </label>
    </div>
  );
}

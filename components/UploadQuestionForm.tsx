'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const UploadQuestionsForm = ({ quesBankId }: { quesBankId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quesBankId', quesBankId);

    try {
      const response = await axios.post('/api/upload-questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Questions uploaded successfully');
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      <Button type="submit" disabled={uploading} className="mt-2">
        {uploading ? 'Uploading...' : 'Upload Questions'}
      </Button>
    </form>
  );
};

export default UploadQuestionsForm;

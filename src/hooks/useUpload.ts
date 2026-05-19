import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadImage(file),
  });
};

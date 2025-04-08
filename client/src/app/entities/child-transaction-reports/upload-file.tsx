import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload, UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/lib/upload';
import getPreSignedUrl from '../../shared/upload/getPreSignedUrl';
import { Translate, translate } from 'react-jhipster';

type Props = {
  id?: string;
  setImageUrl: (url?: string) => void;
  multiple?: boolean;
  title: string;
  acceptTypes: string;
  removeImage?: (imageIndex?: number) => void | undefined;
  maxLength?: number;
  viewType?: string;
  isSuccess?: boolean;
  uploadImageCallback?: () => void;
  uploadingStatus?: (status?: string) => void;
  defaultImages?: UploadFile[];
  label?: string;
};

function UploadImage({
  id,
  setImageUrl,
  multiple,
  title,
  acceptTypes,
  removeImage,
  maxLength,
  viewType,
  isSuccess,
  uploadImageCallback,
  uploadingStatus,
  defaultImages = [],
  label,
}: Props) {
  const [headers, setHeaders] = useState<any>();
  const [fileList, setFileList] = useState<UploadFile[]>(defaultImages);
  console.log('fileList', fileList, "defaultImages", defaultImages);
  const [error, setError] = useState<boolean>(false);

  // States for handling preview
  const [previewMedia, setPreviewMedia] = useState<string>();
  const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  useEffect(() => {
    if (isSuccess) {
      setFileList([]);
    }
  }, [isSuccess]);

  useEffect(() => {
    setFileList(defaultImages);
  }, [defaultImages]);

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    let isVideoFile = false;
    let isPdfFile = false;

    if (file.type) {
      isVideoFile = file.type.startsWith('video');
      isPdfFile = file.type === 'application/pdf';
    } else if (file.url) {
      const fileExtension = file.url.split('.').pop()?.toLowerCase();
      isVideoFile = fileExtension === 'mp4' || fileExtension === 'webm' || fileExtension === 'ogg';
      isPdfFile = fileExtension === 'pdf';
    }

    console.log('isPdfFile', isPdfFile);

    setIsVideo(isVideoFile);
    setIsPdf(isPdfFile); // Set the isPdf state
    setPreviewMedia(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleCancel = () => setPreviewVisible(false);

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const preSignedUrl = await getPreSignedUrl(file.name);

    uploadImageCallback?.();

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', preSignedUrl);
    xhr.upload.onprogress = (event: any) => {
      onProgress({ percent: (event.loaded / event.total) * 100 }, file);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(null, file);
          setImageUrl(xhr.responseURL.split('?')[0]);
        } else {
          onError(xhr.responseText, xhr.response, file);
        }
      }
    };
    xhr.send(file);
  };

  const beforeUpload = async (file: RcFile) => {
    setHeaders({
      'x-amz-acl': 'public-read',
      'Content-Type': file.type,
    });
    const isMax50MB = file.size / 1024 / 1024 < 50;
    if (!isMax50MB) {
      message.error(translate('global.max-size'));
      setError(true);
    }
    return isMax50MB;
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: acceptTypes,
    beforeUpload,
    customRequest: uploadImage,
    onRemove: file => {
      const removedIndex = fileList.findIndex(image => String(image.uid) === String(file.uid));
      if (removeImage && removedIndex !== -1) {
        removeImage(removedIndex + 1);
        setFileList(prevList => prevList.filter((_, index) => index !== removedIndex));
      }
    },
    onChange: data => {
      const { status } = data.file;
      uploadingStatus?.(status);
      if (!error) {
        setFileList(data.fileList);
      }
      setError(false);
    },
    headers,
    maxCount: multiple ? 99 : 1,
  };

  return (
    <div>
      {label ? <label className="upload-label mb-2">{label}</label> : null}

      {viewType && viewType === 'defaultView' && (
        <Upload id={id} {...props} className="main-upload-input" listType="picture" onPreview={handlePreview} fileList={fileList}>
          {maxLength && fileList.length >= maxLength ? null : (
            <Button className="main-upload-input-btn" icon={<UploadOutlined />}>
              <Translate contentKey="global.upload">addParticipation</Translate>
            </Button>
          )}
        </Upload>
      )}

      <Modal
        open={isPreviewVisible} // Replace `visible` with `open`
        footer={null}
        onCancel={handleCancel}
        style={{ cursor: 'pointer' }}
        styles={{
          body: {
            padding: 0,
            height: isPdf ? '80vh' : 'auto',
            overflow: isPdf ? 'hidden' : 'auto',
          },
        }}
        
      >
        <div style={{ position: 'relative', height: isVideo || isPdf ? '100%' : 'auto' }}>
          {isVideo ? (
            <video style={{ width: '100%' }} controls>
              <source src={previewMedia} type="video/mp4" />
              <source src={previewMedia} type="video/webm" />
              <source src={previewMedia} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : isPdf ? (
            <iframe
              src={previewMedia}
              title="PDF Preview"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            >
              This browser does not support PDFs. Please download the file to view it.
            </iframe>
          ) : (
            <img
              src={previewMedia}
              alt="Image Preview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh', // Limit max height for images
                objectFit: 'contain', // Ensure image is fully visible
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default UploadImage;

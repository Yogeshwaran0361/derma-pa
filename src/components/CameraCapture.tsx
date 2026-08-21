import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertCircle, StopCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is restricted in this browser or unsecure HTTP origin. Please use HTTPS or grant Chrome permissions.');
      return;
    }

    try {
      // Primary constraint
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: { ideal: 'environment' } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
        setIsStreaming(true);
      }
    } catch (primaryErr: any) {
      console.warn('Primary camera constraint failed, trying basic fallback:', primaryErr);
      
      try {
        // Fallback basic constraint
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
          setIsStreaming(true);
        }
      } catch (err: any) {
        console.error('Camera Error:', err);
        if (err.name === 'NotAllowedError') {
          setCameraError('Camera permission was denied. Please allow camera access in Chrome Site Settings and try again.');
        } else if (err.name === 'NotReadableError') {
          setCameraError('Camera is currently being used by another application (e.g. Zoom, Teams).');
        } else if (err.name === 'SecurityError') {
          setCameraError('Secure HTTPS connection is required for camera access.');
        } else {
          setCameraError(err.message || t.scanner.cameraError);
        }
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            stopCamera();
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">
      
      {cameraError && (
        <div className="w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Camera Access Notice</span>
          </div>
          <span className="text-[11px] leading-relaxed text-rose-200">{cameraError}</span>
        </div>
      )}

      <div className="relative w-full max-w-lg h-72 bg-black rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
          playsInline
          autoPlay
          muted
        />
        {!isStreaming && (
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Camera className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs">{t.scanner.cameraStart}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{t.scanner.cameraStart}</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleCapture}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Image</span>
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          </>
        )}
      </div>

    </div>
  );
};

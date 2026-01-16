import { useState } from 'react';
import { Loader2, Upload, X, FileText } from 'lucide-react';

interface Step3DocumentsProps {
  data: any;
  onUpdate: (data: any) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export default function Step3Documents({ data, onUpdate, onSubmit, onPrev, isLoading }: Step3DocumentsProps) {
  const [documents, setDocuments] = useState<File[]>(data.documents || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = [...documents, ...files];
    setDocuments(newDocuments);
    onUpdate({ documents: newDocuments });
  };

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
    onUpdate({ documents: newDocuments });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 0) {
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="step-title text-lg font-semibold mb-4">Загрузка документов</h3>
      
      <div>
        <label className="auth-label">
          <span className="visually-hidden">Документы</span>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Загрузите сканы документов регистрации компании
            </p>
            <p className="text-xs text-gray-500 mb-3">
              PDF, JPG, PNG (макс. 5MB на файл)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="document-upload"
            />
            <label
              htmlFor="document-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm"
            >
              Выбрать файлы
            </label>
          </div>
        </label>
        
        {documents.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            Требуется хотя бы один документ
          </p>
        )}
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Загруженные документы:</h4>
          <div className="space-y-2">
            {documents.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="auth-button-secondary flex-1"
          disabled={isLoading}
        >
          Назад
        </button>
        <button
          type="submit"
          className="auth-button flex-1 flex items-center justify-center gap-2"
          disabled={isLoading || documents.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Регистрация...
            </>
          ) : (
            'Зарегистрировать'
          )}
        </button>
      </div>
    </form>
  );
}

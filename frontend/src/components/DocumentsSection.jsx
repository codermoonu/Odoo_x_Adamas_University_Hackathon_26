import { FileIcon, FolderIcon, Trash2Icon, UploadIcon } from 'lucide-react'
import React, { useState } from 'react'

const DocumentsSection = () => {
    const [documents, setDocuments] = useState([])

    const handleUpload = (e) => {
        const files = Array.from(e.target.files || [])
        if(files.length === 0) return
        setDocuments((prev)=> [
            ...prev,
            ...files.map((file)=> ({
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                file,
            })),
        ])
        e.target.value = ""
    }

    const removeDocument = (id) => {
        setDocuments((prev)=> prev.filter((doc)=> doc.id !== id))
    }

    const formatSize = (bytes) => {
        if(bytes < 1024) return `${bytes} B`
        if(bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        <div className='card p-5 sm:p-6 mb-6 max-w-md'>
            <h2 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-800 flex items-center gap-2'>
                <FolderIcon className="w-5 h-5 text-slate-400"/> Documents
            </h2>

            {/* TODO: this is frontend-only - selected files are kept in local state and never uploaded.
                Wire this up to a real upload endpoint once the backend exposes one. */}

            {documents.length === 0 ? (
                <p className='text-sm text-slate-500 mb-5'>No documents uploaded yet.</p>
            ) : (
                <ul className='space-y-2 mb-5'>
                    {documents.map((doc)=>(
                        <li key={doc.id} className='flex items-center justify-between gap-3 p-3 border-2 border-slate-800'>
                            <div className='flex items-center gap-3 min-w-0'>
                                <FileIcon className='w-4 h-4 text-slate-500 shrink-0'/>
                                <div className='min-w-0'>
                                    <p className='text-sm text-slate-800 truncate'>{doc.file.name}</p>
                                    <p className='text-xs text-slate-500'>{formatSize(doc.file.size)}</p>
                                </div>
                            </div>
                            <button type='button' onClick={()=> removeDocument(doc.id)} className='p-1.5 text-slate-500 hover:text-rose-500 shrink-0'>
                                <Trash2Icon className='w-4 h-4'/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <label className='btn-secondary inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center'>
                <UploadIcon className='w-4 h-4'/> Upload Documents
                <input type="file" multiple className='hidden' onChange={handleUpload}/>
            </label>
        </div>
    )
}

export default DocumentsSection

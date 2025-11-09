import React, { useState, useRef, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { createWorker } from "tesseract.js";
import { Button, Card, ProgressBar, Spinner } from "react-bootstrap";
import { FiUpload, FiImage, FiX } from "react-icons/fi";

const ImportedArticle = ({ showModal, setShowModal }) => {
    const [imageText, setImageText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isExtracting, setIsExtracting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match("image.*")) {
            processImage(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.match("image.*")) {
            processImage(file);
        }
    };

    const processImage = (file) => {
        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
            clearInterval(interval);
            setUploadProgress(100);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ✅ Wrap extractText in useCallback so it can safely be a dependency
    const extractText = useCallback(async () => {
        if (!selectedImage) return;
        setIsExtracting(true);
        const worker = await createWorker();
        const {
            data: { text },
        } = await worker.recognize(selectedImage);
        setImageText(text);
        await worker.terminate();
        setIsExtracting(false);
    }, [selectedImage]);

    useEffect(() => {
        if (selectedImage) {
            extractText();
        }
    }, [selectedImage, extractText]); // ✅ ESLint-compliant dependencies

    return (
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            centered
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="h4">Import Article from Image</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <div className="d-flex flex-column gap-4">
                    {/* Drag and Drop Area */}
                    <div
                        className={`border-2 rounded-3 p-5 text-center ${isDragging ? "border-primary bg-light" : "border-dashed bg-light"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        style={{ cursor: "pointer" }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="d-none"
                        />

                        {!selectedImage ? (
                            <div className="d-flex flex-column align-items-center">
                                <FiUpload className="mb-3" size={24} />
                                <h5 className="mb-2">Drag & drop an image here</h5>
                                <p className="text-muted mb-0">or click to browse files</p>
                                <small className="text-muted mt-2">
                                    Supports JPG, PNG (Max 5MB)
                                </small>
                            </div>
                        ) : (
                            <div className="position-relative">
                                <img
                                    src={selectedImage}
                                    alt="Uploaded content"
                                    className="img-fluid rounded-2"
                                    style={{
                                        maxHeight: "200px",
                                        border: "1px solid #dee2e6",
                                    }}
                                />
                                <button
                                    className="position-absolute top-0 end-0 bg-white rounded-circle p-1 border-0 shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage();
                                    }}
                                    style={{ transform: "translate(30%, -30%)" }}
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}

                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-3" style={{ width: "80%", margin: "0 auto" }}>
                                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
                            </div>
                        )}
                    </div>

                    {/* Extracted text section */}
                    <div>
                        <h5 className="mb-3">Extracted Content</h5>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-3">
                                {isExtracting ? (
                                    <div className="text-muted">
                                        <Spinner animation="grow" variant="dark" />
                                    </div>
                                ) : imageText ? (
                                    <div className="text-muted">
                                        {imageText.split("\n").map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <FiImage size={24} className="mb-2 text-muted" />
                                        <p className="text-muted mb-0">
                                            Extracted text will appear here
                                        </p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    disabled={!imageText}
                    onClick={() => {
                        // Handle save functionality here
                        setShowModal(false);
                    }}
                >
                    Save Article
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImportedArticle;

import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Card, Spinner, Badge, Collapse } from 'react-bootstrap';
import { FiSend, FiChevronDown, FiChevronUp, FiMessageSquare } from 'react-icons/fi';
import { BsRobot, BsNewspaper } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';

const Chat = ({ showModal, setShowModal, selectedNews }) => {
    const [newsText, setNewsText] = useState(selectedNews?.description || "");
    const [inputQuestion, setInputQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    // Update news text when selectedNews changes
    useEffect(() => {
        setNewsText(selectedNews?.description || "");
        setChatHistory([]);
        setShowContext(false); // Collapse context when news changes
    }, [selectedNews]);

    const askQuestion = async () => {
        if (!inputQuestion.trim()) return;

        setIsLoading(true);
        const userMessage = {
            sender: "user",
            text: inputQuestion,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            const response = await fetch(
                'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: {
                            question: inputQuestion,
                            context: newsText,
                        },
                    }),
                }
            );

            const result = await response.json();
            const botMessage = {
                sender: "bot",
                text: result.answer || "I couldn't find an answer in the article.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = {
                sender: "bot",
                text: "Sorry, I'm having trouble connecting.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setInputQuestion("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
        }
    };

    return (
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            centered
            className="chat-modal"
        >
            <Modal.Header closeButton className="border-0 pb-0 bg-light-blue">
                <div className="d-flex align-items-center w-100">
                    <BsRobot className="me-2" size={20} color="#1e88e5" />
                    <Modal.Title className="h5 mb-0 flex-grow-1">News Assistant</Modal.Title>
                    <Badge bg="light" text="dark" className="text-uppercase">
                        {selectedNews?.source || "General"}
                    </Badge>
                </div>
            </Modal.Header>

            <Modal.Body className="p-0 d-flex flex-column" style={{ height: "65vh" }}>
                {/* Context Toggle Button */}
                <div
                    className="d-flex justify-content-between align-items-center p-3 border-bottom cursor-pointer bg-hover-light"
                    onClick={() => setShowContext(!showContext)}
                    style={{ userSelect: 'none' }}
                >
                    <div className="d-flex align-items-center">
                        <BsNewspaper className="me-2" color="#1e88e5" />
                        <div>
                            <h6 className="mb-0">News Context</h6>
                            <small className="text-muted text-truncate d-block" style={{ maxWidth: '300px' }}>
                                {selectedNews?.title || "Custom text"}
                            </small>
                        </div>
                    </div>
                    {showContext ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {/* Expandable Context Section */}
                <Collapse in={showContext}>
                    <div className="p-3 border-bottom bg-light">
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={newsText}
                            onChange={(e) => setNewsText(e.target.value)}
                            placeholder="Paste or edit the news article here..."
                            className="mb-2"
                            style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}
                        />
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                {newsText.length} characters
                            </small>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => setShowContext(false)}
                                className="text-primary"
                            >
                                Minimize
                            </Button>
                        </div>
                    </div>
                </Collapse>

                {/* Chat Area */}
                <div className="flex-grow-1 p-3 overflow-auto bg-white">
                    {chatHistory.length === 0 ? (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                            <BsRobot size={48} color="#bbdefb" className="mb-3" />
                            <h5 className="text-muted mb-2">Ask about this news</h5>
                            <p className="text-muted small">
                                Example: "What are the key points?" or "Who was involved?"
                            </p>
                        </div>
                    ) : (
                        <div className="chat-messages">
                            {chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                                >
                                    <div
                                        className={`p-3 rounded-4 position-relative ${msg.sender === "user"
                                            ? "bg-primary text-white user-message"
                                            : "bg-light-blue-10 bot-message"}`}
                                        style={{ maxWidth: "80%" }}
                                    >
                                        <div className="message-text">{msg.text}</div>
                                        <div className={`small text-end mt-1 ${msg.sender === "user" ? "text-white-50" : "text-muted"}`}>
                                            {msg.timestamp || ""}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="d-flex justify-content-start mb-3">
                                    <div className="p-3 rounded-4 bg-light-blue-10">
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        <span className="text-muted">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-top bg-light">
                    <Form.Group className="d-flex align-items-center">
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Type your question..."
                            value={inputQuestion}
                            onChange={(e) => setInputQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="flex-grow-1 me-2 rounded-pill border-0 shadow-sm"
                            style={{ padding: "10px 20px", resize: "none" }}
                        />
                        <Button
                            variant="primary"
                            onClick={askQuestion}
                            disabled={isLoading || !inputQuestion.trim()}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "42px", height: "42px" }}
                        >
                            <IoSend size={18} />
                        </Button>
                    </Form.Group>
                </div>
            </Modal.Body>
        </Modal>
    );
};

// Add this to your CSS or style component
const styles = `
.chat-modal .modal-content {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.bg-light-blue {
    background-color: #f5fbff;
}

.bg-light-blue-10 {
    background-color: rgba(30, 136, 229, 0.1);
}

.bg-hover-light:hover {
    background-color: rgba(30, 136, 229, 0.05);
}

.user-message {
    border-bottom-right-radius: 4px !important;
}

.bot-message {
    border-bottom-left-radius: 4px !important;
}

.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #bbdefb;
    border-radius: 3px;
}

.cursor-pointer {
    cursor: pointer;
}
`;

// Inject styles (or add to your main CSS)
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

export default Chat;
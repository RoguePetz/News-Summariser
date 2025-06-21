import { useState } from "react"

const Sidebar = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState("trending")

    const trendingTopics = [
        { topic: "Technology", count: "2.5k articles" },
        { topic: "Politics", count: "1.8k articles" },
        { topic: "Sports", count: "1.2k articles" },
        { topic: "Health", count: "950 articles" },
        { topic: "Business", count: "780 articles" },
    ]

    const savedArticles = [
        { title: "AI Revolution in Healthcare", time: "2 hours ago" },
        { title: "Climate Change Summit Results", time: "5 hours ago" },
        { title: "Tech Giants Quarterly Reports", time: "1 day ago" },
    ]

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
                padding: "20px",
                boxSizing: "border-box",
                overflowY: "auto",
            }}
        >
            {/* User Profile Section */}
            <div
                style={{
                    background: "white",
                    borderRadius: "15px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 15px",
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                >
                    {user?.charAt(0).toUpperCase()}
                </div>
                <h3 style={{ margin: "0 0 5px", color: "#333", fontSize: "18px" }}>Welcome back!</h3>
                <p style={{ margin: "0 0 15px", color: "#666", fontSize: "14px" }}>{user}</p>
                <button
                    onClick={onLogout}
                    style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "background 0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#c82333")}
                    onMouseOut={(e) => (e.target.style.background = "#dc3545")}
                >
                    Logout
                </button>
            </div>

            {/* Navigation Tabs */}
            <div
                style={{
                    background: "white",
                    borderRadius: "15px",
                    padding: "5px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                }}
            >
                {["trending", "saved"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: "12px",
                            border: "none",
                            borderRadius: "10px",
                            background: activeTab === tab ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                            color: activeTab === tab ? "white" : "#666",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            textTransform: "capitalize",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content based on active tab */}
            <div
                style={{
                    background: "white",
                    borderRadius: "15px",
                    padding: "20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
            >
                {activeTab === "trending" && (
                    <div>
                        <h4 style={{ margin: "0 0 20px", color: "#333", fontSize: "16px" }}>🔥 Trending Topics</h4>
                        {trendingTopics.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "12px 0",
                                    borderBottom: index < trendingTopics.length - 1 ? "1px solid #f0f0f0" : "none",
                                    cursor: "pointer",
                                    transition: "background 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.background = "#f8f9fa")}
                                onMouseOut={(e) => (e.target.style.background = "transparent")}
                            >
                                <div
                                    style={{
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "4px",
                                        fontSize: "14px",
                                    }}
                                >
                                    {item.topic}
                                </div>
                                <div
                                    style={{
                                        color: "#666",
                                        fontSize: "12px",
                                    }}
                                >
                                    {item.count}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "saved" && (
                    <div>
                        <h4 style={{ margin: "0 0 20px", color: "#333", fontSize: "16px" }}>📚 Saved Articles</h4>
                        {savedArticles.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "12px 0",
                                    borderBottom: index < savedArticles.length - 1 ? "1px solid #f0f0f0" : "none",
                                    cursor: "pointer",
                                    transition: "background 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.background = "#f8f9fa")}
                                onMouseOut={(e) => (e.target.style.background = "transparent")}
                            >
                                <div
                                    style={{
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "4px",
                                        fontSize: "14px",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    {item.title}
                                </div>
                                <div
                                    style={{
                                        color: "#666",
                                        fontSize: "12px",
                                    }}
                                >
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div
                style={{
                    background: "white",
                    borderRadius: "15px",
                    padding: "20px",
                    marginTop: "20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h4 style={{ margin: "0 0 15px", color: "#333", fontSize: "16px" }}>📊 Your Stats</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#666", fontSize: "14px" }}>Articles Read</span>
                    <span style={{ color: "#333", fontWeight: "600", fontSize: "14px" }}>47</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#666", fontSize: "14px" }}>Articles Saved</span>
                    <span style={{ color: "#333", fontWeight: "600", fontSize: "14px" }}>12</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontSize: "14px" }}>Reading Streak</span>
                    <span style={{ color: "#333", fontWeight: "600", fontSize: "14px" }}>5 days</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar

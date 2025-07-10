"use client"

import { Clock } from "lucide-react"

export default function TrendingCard({ article, rank }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h ago`
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    const getRankColor = (rank) => {
        if (rank === 1) return { color: "#2563eb", backgroundColor: "#dbeafe" }
        if (rank === 2) return { color: "#3b82f6", backgroundColor: "#dbeafe" }
        if (rank === 3) return { color: "#60a5fa", backgroundColor: "#dbeafe" }
        return { color: "#6b7280", backgroundColor: "#f3f4f6" }
    }

    const containerStyle = {
        padding: "12px 16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    }

    const contentStyle = {
        display: "flex",
        gap: "8px",
    }

    const rankBadgeStyle = {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "bold",
        ...getRankColor(rank),
    }

    const imageStyle = {
        width: "48px",
        height: "48px",
        flexShrink: 0,
    }

    const imageElementStyle = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "8px",
    }

    const textContentStyle = {
        flex: 1,
        minWidth: 0,
    }

    const titleStyle = {
        fontWeight: "500",
        color: "#111827",
        fontSize: "12px",
        lineHeight: "1.4",
        marginBottom: "4px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        transition: "color 0.3s ease",
    }

    const metaStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "10px",
        color: "#6b7280",
        marginBottom: "4px",
    }

    const sourceStyle = {
        fontWeight: "500",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }

    const dateContainerStyle = {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexShrink: 0,
        marginLeft: "8px",
    }

    const categoryStyle = {
        display: "flex",
        gap: "4px",
    }

    const categoryTagStyle = {
        padding: "2px 8px",
        backgroundColor: "#dbeafe",
        color: "#2563eb",
        fontSize: "10px",
        borderRadius: "16px",
    }

    return (
        <div
            style={{
                padding: "12px 16px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb"
                e.currentTarget.querySelector(".title").style.color = "#2563eb"
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.querySelector(".title").style.color = "#111827"
            }}
        >
            <div style={contentStyle}>
                {/* Rank Badge */}
                <div style={rankBadgeStyle}>{rank}</div>

                {/* Image */}
                {article.image_url && (
                    <div style={imageStyle}>
                        <img src={article.image_url || "/placeholder.svg"} alt={article.title} style={imageElementStyle} />
                    </div>
                )}

                {/* Content */}
                <div style={textContentStyle}>
                    <h3 className="title" style={titleStyle}>
                        {article.title}
                    </h3>

                    <div style={metaStyle}>
                        <span style={sourceStyle}>{article.source_name}</span>
                        <div style={dateContainerStyle}>
                            <Clock size={10} />
                            <span>{formatDate(article.pubDate)}</span>
                        </div>
                    </div>

                    {/* Category */}
                    {article.category && article.category.length > 0 && (
                        <div style={categoryStyle}>
                            <span style={categoryTagStyle}>{article.category[0]}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

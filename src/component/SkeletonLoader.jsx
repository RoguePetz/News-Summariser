"use client"

export default function SkeletonLoader() {
  const cardStyle = {
    width: '500px',
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #f3f4f6",
    overflow: "hidden",
    animation: "pulse 1.5s ease-in-out infinite",
  }

  const contentStyle = {
    padding: "16px",
  }

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  }

  const sourceInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const skeletonIconStyle = {
    width: "20px",
    height: "20px",
    backgroundColor: "#e5e7eb",
    borderRadius: "50%",
  }

  const skeletonTextStyle = {
    width: "80px",
    height: "12px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
  }

  const skeletonDateStyle = {
    width: "64px",
    height: "12px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
  }

  const mainContentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  }

  const textContentStyle = {
    flex: 1,
    order: 2,
  }

  const skeletonTitleStyle = {
    width: "100%",
    height: "20px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "8px",
  }

  const skeletonTitle2Style = {
    width: "75%",
    height: "20px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "12px",
  }

  const skeletonDescriptionStyle = {
    marginBottom: "8px",
  }

  const skeletonLineStyle = {
    width: "100%",
    height: "12px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "4px",
  }

  const skeletonLine2Style = {
    width: "83%",
    height: "12px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "4px",
  }

  const skeletonLine3Style = {
    width: "67%",
    height: "12px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "12px",
  }

  const categoriesStyle = {
    display: "flex",
    gap: "4px",
    marginBottom: "12px",
  }

  const skeletonCategoryStyle = {
    width: "56px",
    height: "20px",
    backgroundColor: "#e5e7eb",
    borderRadius: "16px",
  }

  const skeletonCategory2Style = {
    width: "64px",
    height: "20px",
    backgroundColor: "#e5e7eb",
    borderRadius: "16px",
  }

  const actionsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const skeletonButtonStyle = {
    width: "100%",
    height: "32px",
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
  }

  const imageContainerStyle = {
    width: "100%",
    height: "128px",
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
    flexShrink: 0,
    order: 1,
  }

  return (
    <div style={cardStyle}>
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={sourceInfoStyle}>
            <div style={skeletonIconStyle}></div>
            <div style={skeletonTextStyle}></div>
          </div>
          <div style={skeletonDateStyle}></div>
        </div>

        {/* Content */}
        <div style={mainContentStyle}>
          <div style={textContentStyle}>
            <div style={skeletonTitleStyle}></div>
            <div style={skeletonTitle2Style}></div>

            <div style={skeletonDescriptionStyle}>
              <div style={skeletonLineStyle}></div>
              <div style={skeletonLine2Style}></div>
              <div style={skeletonLine3Style}></div>
            </div>

            {/* Categories */}
            <div style={categoriesStyle}>
              <div style={skeletonCategoryStyle}></div>
              <div style={skeletonCategory2Style}></div>
            </div>

            {/* Actions */}
            <div style={actionsStyle}>
              <div style={skeletonButtonStyle}></div>
              <div style={skeletonButtonStyle}></div>
              <div style={skeletonButtonStyle}></div>
            </div>
          </div>

          {/* Image placeholder */}
          <div style={imageContainerStyle}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
